import { attach } from "./store.js";
import Products from "./component/Products.js";

import {
  SORT_PRICE,
  SORT_STAR,
  SORT_TYPE,
  SEARCH,
  ADD_STORE,
} from "./action.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const searchIcon = $(".search-icon");
const rmIcon = $(".rm-icon");
const error = $(".container-search ~ .error");
const Search = $(".search");
const deleteInput = $("#delete-input");
// check user

const checkUser = () => {
  const curUser = window.localStorage.getItem("curUser");
  if (curUser) return true;
};

// func handleCSs
const handleSearchCss = () => {
  // search

  const groupSearch = $(".group-search");
  searchIcon.onclick = () => {
    groupSearch.style.display = "flex";
    searchIcon.style.display = "none";
    Search.focus();
  };

  // btn X

  rmIcon.onclick = () => {
    searchIcon.style.display = "block";
    groupSearch.style.display = "none";
    error.classList.toggle("active");
    error.innerText = "";
    Search.value = "";
  };

  // deleteInput
  deleteInput.onclick = () => {
    Search.value = "";
  };

  // btn-filter
  const btnFilter = $(".btn-filter");
  const menuFilter = $(".menu_filter");

  btnFilter.onclick = (e) => {
    if (menuFilter.style.display != "block") {
      menuFilter.style.display = "block";
    } else if (!e.target.matches(".btn-type")) {
      menuFilter.style.display = "none";
    }
  };

  window.addEventListener("click", (e) => {
    const isBtnFilter = e.target.closest(".btn-filter");
    if (!isBtnFilter) {
      menuFilter.style.display = "none";
    }
  });
};

const products = $(".products");
// func ramdomProduct
const ranDomProduct = () => {
  attach(Products, products);
};

// func search
const handlerSearch = (value) => {
  dispatch(SEARCH, value);
};

// func btn menu
const handleBtnMenu = () => {
  const btnType = $(".btn-type");
  const btnPrice = $(".btn-price");
  const btnStar = $(".btn-star");
  // input search
  const iconSearchOk = $(".icon_search-ok");

  if (!btnPrice || !btnPrice || !btnStar) return;
  const handleSearch = () => {
    const value = Search.value.trim();
    if (value.length == 0) {
      error.innerText = "Bạn chưa điền dữ liệu tìm kiếm!";
      if (error.classList.contains("active")) error.classList.remove("active");
      else {
        error.classList.add("active");
      }
    } else {
      error.classList.toggle("active");
      error.innerText = "";
      handlerSearch(value);
    }
    Search.focus();
  };
  iconSearchOk.onclick = handleSearch;

  window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      iconSearchOk.click();
    }
  });

  btnPrice.onclick = () => {
    dispatch(SORT_PRICE);
    renderBTN();
  };

  btnStar.onclick = () => {
    dispatch(SORT_STAR);
    renderBTN();
  };

  btnType.onclick = (e) => {
    // console.log(e.target.dataset.type);
    if (!e.target.matches(".btn-type")) {
      const value = e.target.dataset.type;
      dispatch(SORT_TYPE, value);
    } else {
      e.preventDefault();
    }
  };
};

// add Store

const renderBTN = () => {
  const btnCarts = $$(".btn-cart");
  if (!btnCarts) return;
  for (let i = 0; i < btnCarts.length; i++) {
    btnCarts[i].addEventListener("click", (e) => {
      const itemIndex = e.target.closest(".product").dataset.id;
      if (checkUser()) {
        dispatch(ADD_STORE, itemIndex);
        renderBTN();
        toast({
          type: "success",
          title: "Đã thêm!",
          massage: "Vào giỏ hàng để xem sản phẩm",
          duration: 1500,
        });
      } else {
        toast({
          type: "error",
          title: "Lỗi rồi!",
          massage: "Bạn phải đăng nhập để thêm vào giỏ hàng của mình!",
          duration: 1500,
        });
      }
    });
  }
};

// remove toast

const handleAddstore = () => {
  renderBTN();
};

const viewDetailProduct = () => {
  const btnBuy = $$(".btn-buy");
  btnBuy.forEach((e) => {
    e.addEventListener("click", (i) => {
      const idItem = i.target.closest(".product").dataset.id;
      localStorage.removeItem("detail-product");
      localStorage.setItem("detail-product", idItem);
    });
  });
};

// func main
const productMain = () => {
  handleSearchCss();
  // ranDomProduct();
  ranDomProduct();
  // Handle btn menu
  handleBtnMenu();
  // Handle add store
  handleAddstore();
  // details
  viewDetailProduct();
};

productMain();
