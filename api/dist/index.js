import express from "express";
import { connectDb } from "./db.js";
import productsRouter from "./routes/products/index.js";
const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(express.json());
app.use('/products', productsRouter);
try {
    await connectDb();
    app.listen(port, () => {
        console.log(`Database connected`);
        console.log(`Server is running on port ${port}`);
    });
}
catch (error) {
    console.error("Failed to connect database", error);
    process.exit(1);
}
