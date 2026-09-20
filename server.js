const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const app = express();

if (config.cors.enabled) {
    app.use(cors({
        origin: config.cors.origin
    }));
}

app.get("/", function (req, res) {
    res.json({
        name: "BradensSkinProxy", status: "running"
    });
});

app.get("/api/minecraft/:username", async function (req, res) {
    try {
        const username = req.params.username;

        const profileUrl = config.minecraft.profileApi + encodeURIComponent(username);

        const uuidResponse = await fetch(profileUrl);

        if (!uuidResponse.ok) {
            return res.status(404).json({
                error: "Minecraft player not found."
            });
        }

        const profile = await uuidResponse.json();

        const sessionUrl = config.minecraft.sessionApi + profile.id;

        const sessionResponse = await fetch(sessionUrl);

        if (!sessionResponse.ok) {
            return res.status(502).json({
                error: "Could not fetch Minecraft profile."
            });
        }

        const sessionProfile = await sessionResponse.json();

        const textureProperty = sessionProfile.properties.find(function (property) {
            return property.name === "textures";
        });

        if (!textureProperty) {
            return res.status(404).json({
                error: "Minecraft skin texture not found."
            });
        }

        const textureData = JSON.parse(Buffer.from(textureProperty.value, "base64").toString("utf8"));

        const skinUrl = textureData.textures && textureData.textures.SKIN && textureData.textures.SKIN.url;

        if (!skinUrl) {
            return res.status(404).json({
                error: "Minecraft skin URL not found."
            });
        }

        res.json({
            username: profile.name, uuid: profile.id, skinUrl: skinUrl.replace("http://", "https://")
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error."
        });
    }
});

app.listen(3000, "0.0.0.0", function () {
    console.log("BradensSkinProxy running on port 3000");
});