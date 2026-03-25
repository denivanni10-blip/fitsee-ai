import { fitseeEngine } from "../../lib/fitseeEngine.js"

export async function POST(req) {

  const body = await req.json()

  const personImage = body.personImage
  const garmentImage = body.garmentImage

  const result = await fitseeEngine({
    personImage,
    garmentImage
  })

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" }
  })
}