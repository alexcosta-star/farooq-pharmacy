import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

// Fetch available medicines from database
async function getAvailableMedicines() {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                name: data.name,
                price: data.price,
                description: data.description || ''
            };
        });
        return products;
    } catch (error) {
        console.error("Error fetching medicines:", error);
        return [];
    }
}

export async function POST(request: Request) {
    try {
        const { message, history } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Get available medicines
        const medicines = await getAvailableMedicines();
        const medicineList = medicines.length > 0
            ? medicines.map(m => `- ${m.name}: Rs. ${m.price}${m.description ? ` (${m.description})` : ''}`).join('\n')
            : 'Abhi koi medicine stock mein nahi hai.';

        const client = new OpenAI({
            apiKey: GROQ_API_KEY,
            baseURL: "https://api.groq.com/openai/v1",
        });

        const systemPrompt = `Tu Farooq Pharmacy ka assistant hai jo Dera Ghazi Khan, Pakistan mein hai. Tu Roman Urdu mein baat karta hai.

HAMARE PAAS YE MEDICINES AVAILABLE HAIN:
${medicineList}

Tera kaam:
- Customer ko medicines dhundhne mein madad karo
- Medicines ki information do aur unhe convince karo ke hamare paas best quality aur prices hain
- Hamesha encourage karo: "Hum se khareedein, best prices milenge!" ya "Farooq Pharmacy se order karein, quality guaranteed!"
- WhatsApp pe order karne ka number: 03310076524
- Dost jaisa friendly aur helpful baat karo
- Agar medicine list mein nahi hai, to bolo "Abhi stock mein nahi hai, lekin aap pharmacy call kar sakte hain"
- Medical advice mat do, doctor se milne ko bolo
- Jab medicine recommend karo, to uski price bhi batao

Chhoti aur friendly responses do. Encourage customer to buy from Farooq Pharmacy!
Example responses:
- "Ji bilkul! Panadol Rs. 50 mein available hai. Abhi WhatsApp pe order karein!"
- "Ap sahi jagah aaye! Hamare paas best medicines hain affordable prices pe!"
- "Farooq Pharmacy se better option nahi milega DG Khan mein!"`;

        const messages: any[] = [
            { role: "system", content: systemPrompt },
            ...(history || []),
            { role: "user", content: message }
        ];

        const completion = await client.chat.completions.create({
            messages,
            model: "llama-3.1-8b-instant",
            temperature: 0.8,
            max_tokens: 300,
        });

        const reply = completion.choices[0]?.message?.content || "Maaf kijiye, kuch problem ho gayi. Dobara try karein!";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
