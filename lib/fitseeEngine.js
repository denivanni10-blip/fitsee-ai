export async function fitseeEngine({ personImage, garmentImage }) {

const response = await fetch("https://api.replicate.com/v1/predictions", {
method: "POST",
headers: {
"Authorization": `Token SUA_CHAVE_REPLICATE`,
"Content-Type": "application/json"
},
body: JSON.stringify({
version: "ac732df83cea7fff0dea9a3c4c64d1d8d0c8b1e7a49f7e4b06c574ea50649259",
input: {
person_image: personImage,
garment_image: garmentImage
}
})
})

const data = await response.json()

return data
}