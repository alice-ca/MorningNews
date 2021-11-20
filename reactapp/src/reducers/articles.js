export default function (wishList = [], action) {

    if (action.type == 'saveArticles') {
        return action.articles

    } else if (action.type == 'addArticle') {
        let wishListCopy = [...wishList]

        if (!wishListCopy.some(article => article.title === action.articleLiked.title)) {
            wishListCopy.push(action.articleLiked)
        }
        return wishListCopy

    } else if (action.type == 'deleteArticle') {

        return wishList.filter(article => article.title !== action.title)

    } else {
        return wishList
    }
}