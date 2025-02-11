// routes/itemRoutes.ts
import express, { Request, Response } from 'express';
import {Item} from '../models/itemModel';
import verifyToken from './../middleware/authMiddleware';

const router = express.Router();

// Route to create a new item (protected)
router.post('/add', verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { name, desc, pricePerDay, pricePerDays, type, img, kauce } = req.body;

  try {
    // Create a new item with the provided data
    const newItem = new Item({
      name,
      desc,
      pricePerDay,
      pricePerDays,
      type,
      img,
      kauce, // Added kauce field
    });

    // Save the new item to the database
    const savedItem = await newItem.save();
    res.status(201).json(savedItem); // Send back the saved item
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Chyba serveru', error: error.message });
    } else {
      res.status(500).json({ message: 'Chyba serveru' });
    }
  }
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
    // Fetch all items from the database
    const items = await Item.find();
    res.status(200).json(items); // Send back the list of items
    } catch (error: unknown) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Chyba serveru', error: error.message });
    } else {
        res.status(500).json({ message: 'Chyba serveru' });
    }
    }
});

export default router;
