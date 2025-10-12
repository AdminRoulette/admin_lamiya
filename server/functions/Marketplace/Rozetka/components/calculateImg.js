async function calculateImg(product, option) {

        let imagesList = []
        for(const image of option.deviceimages){
            imagesList.push(image.image.replace(".webp", ".jpg"))
        }
        return imagesList;

}

module.exports = calculateImg;
