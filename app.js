let elList = document.querySelector(".list");
let category = document.querySelector("#category");

let countPage = 1;

let product_Link = `https://dummyjson.com/products?limit=20&skip=${
  countPage * 20
}&select=title,price`;
let product_category = `https://dummyjson.com/products/categories`;
let DataProduct;
let filterArr = [];

allProductApi(product_Link);

function allProductApi(link) {
  fetch(link)
    .then((res) => res.json())
    .then((data) => {
      elList.innerHTML = "";
      HtmlCard(data, elList);
    })
    .catch((err) => {
      console.log(err);
    });
}

function allCategories(params) {
  fetch(params)
    .then((res) => res.json())
    .then((data) => {
      htmlSelect(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
allCategories(product_category);

function HtmlCard(data, HtmlElement) {
  DataProduct = data;
  data.products.forEach((element) => {
    let render = `
    <li class="item">
    ${
      element.category
        ? `<p class="item__categories">${element.category}</p>`
        : ""
    }
    
    <p class="item__title">${element.title}</p>
    ${
      element.thumbnail
        ? `<img
      class="item__img"
      src=${element?.thumbnail}
      alt="an img"
    />`
        : ""
    }
    

    <div class="item_foot">
        <span>${element.price}$</span>
        <button data-id=${element.id} class="basket_btn">
        <img data-id=${
          element.id
        } class="basket_img" src="./images/Subtract.svg" width="12" height="12" alt="an image" />
        </button>
    </div>

  </li>
        `;

    HtmlElement.insertAdjacentHTML("beforeend", render);
  });
}

function HtmlCardFilter(data, HtmlElement) {
  data.forEach((element) => {
    let render = `
    <li class="item">
    ${
      element.category
        ? `<p class="item__categories">${element.category}</p>`
        : ""
    }
    
    <p class="item__title">${element.title}</p>
    ${
      element.thumbnail
        ? `<img
      class="item__img"
      src=${element?.thumbnail}
      alt="an img"
    />`
        : ""
    }
    <div class="item_foot">
        <span>${element.price}$</span>
        <button data-id=${element.id} class="delete_btn">
          delete
        </button>
    </div>

  </li>
        `;

    HtmlElement.insertAdjacentHTML("beforeend", render);
  });
}
elList.addEventListener("click", function (e) {
  if (e.target.matches(".basket_img") || e.target.matches(".basket_btn")) {
    let btn_dataset_id = e.target.dataset.id;
    let [filterEl] = DataProduct.products.filter((e) => e.id == btn_dataset_id);
    if (!filterArr.includes(filterEl)) {
      filterArr.push(filterEl);
    }
  }
  if (e.target.matches(".delete_btn")) {
    let btn_dataset_id = e.target.dataset.id;

    let foundDeleteIndex = filterArr.findIndex((e) => e.id == btn_dataset_id);

    filterArr.splice(foundDeleteIndex, 1);
    elList.innerHTML = "";
    HtmlCardFilter(filterArr, elList);
  }
});

function htmlSelect(params) {
  params.forEach((element) => {
    let render = `
    <option class="option" value=${element}>${element}</option>
    `;
    category.insertAdjacentHTML("beforeend", render);
  });
}

document.querySelector(".head_btn").addEventListener("click", function (e) {
  let value = document.querySelector(".head__search").value.trim();
  if (value.trim().length > 0) {
    elList.innerHTML = null;
    allProductApi(`https://dummyjson.com/products/search?q=${value}`);
  } else {
    allProductApi(product_Link);
    elList.innerHTML = null;
  }
});

document.querySelector("#category").addEventListener("change", function (e) {
  if (e.target.value != "all") {
    elList.innerHTML = null;
    allProductApi(`https://dummyjson.com/products/category/${e.target.value}`);
  } else {
    elList.innerHTML = null;
    allProductApi(product_Link);
  }
});

document
  .querySelector(".button_filter")
  .addEventListener("click", function (e) {
    elList.innerHTML = "";
    HtmlCardFilter(filterArr, elList);
  });

fetch("https://dummyjson.com/products?limit=20&skip=0&select=title,price")
  .then((res) => res.json())
  .then((e) => console.log(e));

document
  .querySelector("#prevPage")
  .addEventListener("click", function (params) {
    if (countPage > 1) {
      countPage = countPage - 1;
      allProductApi(product_Link);
      document.querySelector("#countPage").textContent = countPage;
      product_Link = `https://dummyjson.com/products?limit=20&skip=${
        countPage * 20
      }&select=title,price`;
    }
  });

document
  .querySelector("#nextPage")
  .addEventListener("click", function (params) {
    if (countPage < 4) {
      countPage = countPage + 1;
      document.querySelector("#countPage").textContent = countPage;
      product_Link = `https://dummyjson.com/products?limit=20&skip=${
        countPage * 20
      }&select=title,price`;
      allProductApi(product_Link);
    }

    console.log(product_Link);
  });
