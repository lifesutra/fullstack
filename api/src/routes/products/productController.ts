import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import db from "../../db/index.js";
import { productsTable } from "../../db/productSchema.js";

export async function listProducts(req: Request, res: Response) {
    try { 

        const products = await db.select().from(productsTable);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getProduct(req: Request, res: Response) {
    try { 
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid product id" });
        }

        const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function createProduct(req: Request, res: Response) {
    const { name, description, image, price } = req.body ?? {};

 
    try {
        const [product] = await db.insert(productsTable).values({
            name,
            description,
            image,
            price,
        }).returning();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error});
    }
}

export async function deleteProduct(req: Request, res: Response) {
    try { 

        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid product id" });
        }

       const [deltetedProduct] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
        if(!deltetedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }else{
            res.status(204).json(deltetedProduct);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

export function getProductById(req: Request, res: Response) {
    try { } catch (error) {
        res.status(500).send(error);
    }
}

export async function updateProduct(req: Request, res: Response) {
    try { 

        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid product id" });
        }

        const { name, description, image, price } = req.body ?? {};
        const updateData: Partial<typeof productsTable.$inferInsert> = {};

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        if (price !== undefined) {
            const numericPrice = Number(price);

            if (Number.isNaN(numericPrice)) {
                return res.status(400).json({ error: "Invalid product price" });
            }

            updateData.price = numericPrice;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No product fields provided" });
        }

        const [updatedProduct] = await db.update(productsTable).set(updateData).where(eq(productsTable.id, id)).returning();

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).send(error);
    }
}

