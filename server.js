import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/restaurants", async (req, res) => {
    const { city } = req.query;

    try {
        const response = await axios.get(
            "https://api.yelp.com/v3/businesses/search",
            {
                headers: {
                    Authorization: `Bearer ${process.env.YELP_API_KEY}`,
                },
                params: {
                    term: "restaurants",
                    location: city,
                    radius: 8000,
                    limit: 10,
                },
            },
        );

        const results = response.data.businesses.map((b) => ({
            name: b.name,
            rating: b.rating,
            address: b.location.display_address.join(", "),
            coordinates: b.coordinates,
        }));

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
