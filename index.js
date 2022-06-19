let form = document.getElementById("form");
let result = document.querySelector(".results");
let url = "https://jsonplaceholder.typicode.com/posts";
let titles = document.querySelector("input");
let bodys = document.querySelector("textarea");

function navbar() {
    let navList = document.getElementsByClassName("nav-links");
    for (var i = 0; i < navList.length; i++) {
        navList[i].addEventListener("click", function(e) {
            e.preventDefault();
            let navLink = (document.querySelector(".navLink").style.display = "none");
            let signButton = (document.querySelector(".sign").style.display = "none");
            let nav = document.querySelector(".nav");
            nav.classList.toggle("show-div");
            console.log(e);
        });
    }
}

const hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", function(e) {
    console.log(e);
    let nav = document.querySelector(".nav");
    nav.classList.toggle("show-div");

    let navLink = document.querySelector(".navLink");
    let signButton = document.querySelector(".sign");

    if (
        navLink.style.display === "block" &&
        signButton.style.display === "block"
    ) {
        navLink.style.display = "none";
        signButton.style.display = "none";
    } else {
        navLink.style.display = " block";
        signButton.style.display = "block";
    }
    navbar();
});

//get the post
function fetchPost() {
    fetch(`${url}/?_limit=3`)
        .then((response) => response.json())
        .then((json) => callDataToDom(json))
        .then((data) => runResult(data));
}
window.addEventListener("DOMContentLoaded", () => {
    fetchPost();
});

function callDataToDom(datas) {
    setToStorage(datas);
    getFromLocalStorage();
    return datas;
}

function setToStorage(item) {
    localStorage.setItem("KCitem", JSON.stringify(item));
}

function getFromLocalStorage() {
    if (localStorage.key("KCitem") != "") {
        let fetchedItem = JSON.parse(localStorage.getItem("KCitem"));
        updateDisplay(fetchedItem);
    } else {
        return;
    }
}

function updateDisplay(datas) {
    let item = "";
    datas.forEach((data) => {
        item += ` <div class ="border col-lg-12 m-2 p-0" data-id=${data.id}>
        <h3 class="card-title bg-primary text-white p-3 m-0 rounded">${
          data.title
        }</h3>
  <p class="card-body p-3">${data.body.slice(0, 20)}</p>
 <button id="del" class="btn btn-primary remove mx-auto my-2" >remove</button>
  <a href="#" id="view" class="text-primary remove mx-auto my-2" >view more</a>
     <a href="#" id="edit" class="text-primary remove mx-auto my-2" >Edit</a>
</div>`;
    });
    result.innerHTML = item;
}

function runResult(data) {
    result.addEventListener("click", (e) => {
        e.preventDefault();
        let btndel = e.target.id == "del";
        let viewbtn = e.target.id == "view";
        let editbtn = e.target.id == "edit";
        let id = e.target.parentElement.dataset.id;
        //remove post
        if (btndel) {
            axios.delete(`${url}/${id}`).then(() => console.log("deleted"));

            let newData = data.filter((item) => item.id != id);
            updateDisplay(newData);
        }
        if (viewbtn) {
            let newData = data.find((item) => item.id == id);
            console.log(newData);
            let item = "";
            item += `
            <div class="">
            <div class="mr-auto my-5 hideView" onClick="hideView()"> <i class="fa fa-times "></i></div>
             <h3 class="card-title bg-primary text-white p-3 m-0 rounded">${newData.title}</h3>
  <p class="card-body p-3">${newData.body}</p>
            </div>`;
            let viewMore = document.querySelector("#viewMore");
            viewMore.innerHTML = item;
            viewMore.classList.remove("view-more-page");
            viewMore.classList.add("translated");
        }
        if (editbtn) {
            updateBlogPost(id);
        }
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify({
                title: titles.value,
                body: bodys.value,
                userId: 1,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            let dataArr = [];
            dataArr.push(data);
            let item = "";
            dataArr.forEach((data) => {
                item += ` <div class ="border  m-2 p-0" data-id=${data.id}>
        <h3 class="card-title bg-primary text-white p-3 m-0 rounded">${data.title}</h3>
  <p class="card-body p-3">${data.body}</p>
 <button id="del" class="btn btn-primary remove mx-auto my-2" >remove</button>
  <a href="#" id="view" class="text-primary remove mx-auto my-2" >view more</a>
   <a href="#" id="edit" class="text-primary remove mx-auto my-2" >Edit</a>
</div>`;
            });
            result.innerHTML += item;
            return data;
        })
        .then((data) => runResult(data))
        .catch((err) => console.error(err));
    titles.value = "";
    bodys.value = "";
});

function hideView() {
    let viewMore = document.querySelector("#viewMore");

    viewMore.classList.remove("translated");
    viewMore.classList.add("view-more-page");
}

//link in your html
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
function delPost(id) {
    let url = "https://jsonplaceholder.typicode.com/posts";
    axios.delete(`${url}/${id}`).then(() => console.log("deleted"));
    console.log(data);
    let newData = data.filter((item) => item.id != id);
    console.log(newData);
}

function updateBlogPost(id) {
    console.log(id);

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                id: id,
                title: titles.value,
                body: bodys.value,
                userId: 1,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then((response) => response.json())
        .then((data) => {
            let BlogTitles = document.querySelectorAll(".card-title");
            let BlogBodies = document.querySelectorAll(".card-body");

            BlogTitles.forEach((BlogTitle, index) => {
                if (index + 1 === id) {
                    if (data.title !== "") {
                        BlogTitle.innerHTML = data.title;
                    }
                }
            });

            BlogBodies.forEach((BlogBody, index) => {
                if (index + 1 === id) {
                    if (data.body !== "") {
                        BlogBody.innerHTML = data.body;
                    }
                }
            });
        });
}