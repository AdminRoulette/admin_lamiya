function ratingName(count, language) {
    let mod = count % 10;
    return count === 1 || mod === 1 ? language ? `${count} отзыв` : `${count} відгук`
        : count >= 2 && count <= 4 || mod === 2 || mod === 3 || mod === 4
            ? language ? `${count} отзыва` : `${count} відгуки`
            : language ? `${count} отзывов` : `${count} відгуків`

}

module.exports = ratingName;