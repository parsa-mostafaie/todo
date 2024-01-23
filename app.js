// Load HTML Elements
var list = document.querySelector("#list");
var btn_add = document.querySelector("#btn_add");
var work = document.querySelector("#work");
var empty = document.querySelector("#empty");
var search = document.querySelector("#search");

// Search Functions
var searchIn = (lst, searchVal) => {
    DisableAll(list); // Hide All Items
    for (let item of lst.children) {
        if (new RegExp(work.value).test(searchVal)) {
            item.classList.remove("d-none");
        }
    }
    refresh_res();
};

function refresh_res() {
    if (list.querySelectorAll(":not(.d-none)").length == 0) {
        empty.classList.remove("d-none");
    } else {
        empty.classList.add("d-none");
    }
}

// Todo Items
function MakeItem(str, def_class = ["bg-white"]) {
    let item = document.createElement("li");
    item.classList.add(
        ..."w-100 p-2 rounded mb-1 d-flex justify-content-between text-dark align-items-start".split(
            " "
        ),
        ...def_class
    );
    item.innerHTML = `<span class='w-75'>${str}</span><span class='d-flex align-items-center'><button class='btn-close' onclick='closeClick(event)'></button></span>`;
    item.addEventListener("click", () => {
        item.classList.toggle("bg-white");
        item.classList.toggle("bg-light");
        item.classList.toggle("text-decoration-line-through");
        save(item);
    });
    return item;
}

function closeClick(e) {
    let target_parent = e.target.parentElement.parentElement;
    e.stopPropagation();
    if (confirm(`are you sure? (remove '${target_parent.textContent}')`)) {
        target_parent.remove();
        localStorage.removeItem("work" + indexOfChild(target_parent));
        refresh_res();
    }
}

// Load From Storage
load();

// Events
window.addEventListener("unload", () => {
    localStorage.setItem("len", list.children.length);
});

search.addEventListener("click", () => searchIn(list, work.value));

btn_add.addEventListener("click", () => {
    let txt = work.value.trim();
    if (txt != "") {
        let nitem = MakeItem(txt);
        list.appendChild(nitem);
        save(nitem);
    }
    work.value = "";
    searchIn(list);
});

// Local Storage
function save(el) {
    let i = indexOfChild(el);
    let val = {
        checked: el.matches(".text-decoration-line-through"),
        content: el.textContent,
    };
    localStorage.setItem("work" + i.toString(), JSON.stringify(val));
}

function load() {
    let len = localStorage.getItem("len");
    console.log(len);
    for (let i = 0; i < len; i++) {
        let obj = JSON.parse(localStorage.getItem("work" + i.toString()));
        let def_class = obj.checked
            ? "bg-light text-decoration-line-through"
            : "bg-white";
        list.appendChild(MakeItem(obj.content, def_class.split(" ")));
    }

    refresh_res();
}

function clearStorage() {
    localStorage.clear();
    localStorage.setItem("len", "");
    location.reload();
}

// DOM
function indexOfChild(el) {
    return Array.from(el.parentElement.children).indexOf(el);
}

function DisableAll(parent) {
    for (let item of parent.children) {
        item.classList.add("d-none");
    }
}