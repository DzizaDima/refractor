document.addEventListener('DOMContentLoaded', ()=>{
    init()
})

function init(){
    let sections = document.querySelectorAll('.featured-products')
    sections.forEach(section => {
        updateSection(section)
        checkCardsAmount(section, section)
    })
}

function updateSection(section){
    subscribe(PUB_SUB_EVENTS.cartUpdate, (event) =>{
        if(section){
            let loader = section.querySelector('.featured-products .loader')
            loader.classList.add('active')
            fetch(window.Shopify.routes.root +'?section=featured-products')
            .then((response) => response.text())
            .then((html) => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let sectionNew = doc.querySelector('.featured-products')
                let sectionInnerNew = doc.querySelector('.featured-products__inner')

                if(checkCardsAmount(sectionNew, section)){
                    sectionNew.querySelector('.featured-products__inner').innerHTML = sectionInnerNew.innerHTML
                }
            })
            .catch(function (err) {
                console.warn('Something went wrong.', err);
            });
        }
    })
}

function checkCardsAmount(sectionToCheck, domSection){
    let sectionCardsAmount = sectionToCheck.querySelectorAll('.featured-products-product-card').length

    if(sectionCardsAmount > 0){
        return true
    }else{
        domSection.classList.add('hidden')
        return false
    }
}