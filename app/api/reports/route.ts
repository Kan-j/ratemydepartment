import axios from 'axios'
import path from 'path'; 
import { promises as fs } from 'fs';

export async function POST(req: Request) {
  const {text} = await req.json(); // Assuming word data is sent in the request body

  try {
    // QuickChart Word Cloud API options
    const apiUrl = 'https://quickchart.io/wordcloud';
    const options = {
      method: 'POST',
      url: apiUrl,
      data: {
        text,
        format: 'png', // Set the format to PNG
        width: 800, // Set the width of the image
        height: 600, // Set the height of the image
        fontFamily: 'Arial', // Set the font family
        fontWeight: 'normal', // Set the font weight
        fontScale: 20, // Set the font scale
        scale: 'linear', // Set the scale
        padding: 2, // Set the padding
      },
      responseType: 'arraybuffer', // Handle image data
    };

    // Fetch the image data from QuickChart API
    const response = await axios.post(apiUrl, options.data, {
      responseType: 'arraybuffer',
    });

    const imageBuffer = response.data;
    const filename = `${Date.now()}.png`;
    const dirPath = path.join(process.cwd(), 'public/images/reports/wordclouds');
    const filePath = path.join(dirPath, filename);

    // Ensure the directory exists
    await fs.mkdir(dirPath, { recursive: true });

    // Save the image buffer to the file
    await fs.writeFile(filePath, imageBuffer);

    // Encode image data as base64
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${base64Image}` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error:any) {
    console.error('Error generating word cloud image:', error);
    return Response.json({ error: 'Failed to generate word cloud: ' + error.message });
  }
}