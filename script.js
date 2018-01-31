class User {
    constructor(id, gender, name, phone, email, picture, registered) {
        this.id = id;
        this.gender = gender;
        this.name = `${name.first} ${name.last}`;
        this.phone = phone;
        this.email = email;
        this.picture = picture.large;
        this.registered = registered;
    }
}

class ApiService {
    getData(page, items) {
        const API_URL = page ? `https://randomuser.me/api/?page=${page}&results=${items}` :
            `https://randomuser.me/api/?page=1&results=${items}`;
        console.log(API_URL);
        return window.
        fetch(API_URL, {method: 'GET'})
            .then(response => response.json())
    .then(response => this.handleResponse(response));
    }

    transformData(users = []) {
        return users.map(user => {
            return new User(
                user.id,
                user.gender,
                user.name,
                user.phone,
                user.email,
                user.picture,
                user.registered,
            );
    });
    }

    handleResponse(response) {
        return this.transformData(response.results);
    }
}

class ViewService {
    constructor(container) {
        this.container = container;
    }

    getItemTemplate(user) {
        return `<article class="user">
                <div class="user-picture">
                    <div class="${user.gender}"></div>
                    <div class="user-avatar">
                    	<img src="${user.picture}" alt="${user.name}">
                    </div>
                </div>
                <div class="user-info">
                		<h2 class="user-name">${user.name}</h2>
                    <div class="parametr">
                        <div class="label">Phone:</div>
                        <div class="value">${user.phone}</div>
                    </div>
                    <div class="parametr">
                        <div class="label">Email:</div>
                        <div class="value">${user.email}</div>
                    </div>
                    <div class="parametr">
                        <div class="label">Registered:</div>
                        <div class="value">${user.registered}</div>
                    </div>
                </div>
            </article>`
    }

    getGender() {
        return
    }

    getWidgetTemplate(users = []) {
        return users.reduce((template, user) => template + this.getItemTemplate(user), '');
    }

    renderWidget(users) {
        var pageWrap = document.createElement("div");
        pageWrap.innerHTML = this.getWidgetTemplate(users);
        this.container.appendChild(pageWrap);
    }
}

function log(...args) {
    console.log(...args);
}

class ScrollObserver {
    init(target, loadMore) {
        const options = {
            rootMargin: '0px'
        };

        function callback(entries) {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                return;
            }

            loadMore();
        });
        }
        const observer = new IntersectionObserver(callback, options);

        observer.observe(target);
    }
}

class Main {
    static init() {
        const apiService = new ApiService();
        const container = document.querySelector('.users-widget');
        const viewService = new ViewService(container);
        const target = document.querySelector('.load-more');
        const scrollObserver = new ScrollObserver();
        var page = 1;

        function loadMore() {
            apiService
                .getData(page, 10)
                .then((users) => {
                viewService.renderWidget(users);
        })
        .catch(log);
            page++;
        }
        setTimeout(() => {
            scrollObserver.init(target, loadMore.bind(this));
    }, 1000);
    }
}

Main.init();
