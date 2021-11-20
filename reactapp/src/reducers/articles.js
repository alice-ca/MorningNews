export default function (wishList = [], action) {

    if (action.type == 'saveArticles') {
        return action.articles

    } else if (action.type == 'addArticle') {
        let wishListCopy = [...wishList]
        /*let findArticle = false;
        for(let i=0;i<wishListCopy.length;i++){
            if(wishListCopy[i].title == action.articleLiked.title){
                findArticle = true
            }
        }*/

        if (!wishListCopy.some(article => article.title === action.articleLiked.title)) {
            wishListCopy.push(action.articleLiked)
        }
        return wishListCopy

    } else if (action.type == 'deleteArticle') {
        /*let wishListCopy = [...wishList]
        var position = null

        for (let i = 0; i < wishListCopy.length; i++) {
            if (wishListCopy[i].title == action.title) {
                position = i
            }
        }
        if (position != null) {
            wishListCopy.splice(position, 1)
        }*/

        return wishList.filter(article => article.title !== action.title)

    } else {
        return wishList
    }
}