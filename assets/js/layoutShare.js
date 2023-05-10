const apiUrl = 'https://simflix.online';

async function saveLayout() {
    return new Promise(async (resolve, reject) => {
        const name = window.appId;

        if ("user" in localStorage) {
            if (JSON.parse(localStorage.getItem("user")).length < 1) {
                resolve('ERROR')
            } else {
                window.user = JSON.parse(localStorage.getItem("user"));
            }
        }

        let settings = {
            "url": `${apiUrl}/user/save?name=${name}`,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(window.user),
        };

        $.ajax(settings).done(async function (response, data) {
            return resolve(response);
        })
        resolve(true);
    });
}

async function getLayoutShare(id) {
    return new Promise(async (resolve, reject) => {
        let code = id;

        let settings = {
            "url": `${apiUrl}/user/get?name=${code}`,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
        };

        $.ajax(settings).done(function (response, data) {
            resolve(response.data);
        }).catch(error => {
            Swal.fire({
                icon: 'error',
                text: 'Failed, Please Check AppList ID',
                target: 'body',
                timer: 2000,
                allowOutsideClick: true,
            });
            reject('error');
        });
    });
}

async function createLayoutShareId() {
    return new Promise(async (resolve, reject) => {
        let settings = {
            "url": `${apiUrl}/user/create`,
            "method": "GET",
        };

        $.ajax(settings).done(function (response, data) {
            resolve(response.data);
        })
    });
}

async function getGeneratedIDs() {
    $.getJSON('https://simflix.online/generatedCodes.json', function(data) {
        console.log(data);
    });
}

function submitFeedBack(feedback, rating) {
    $('#feedBackModal').modal('hide');
    window.user.settings.feedbacksubmit = true;
    localStorage.setItem("user", JSON.stringify(window.user));

    return new Promise(async (resolve, reject) => {
        const name = window.appId;

        let settings = {
            "url": `${apiUrl}/user/feedback?name=${name}&rating=${rating}`,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": feedback,
        };

        $.ajax(settings).done(async function (response, data) {
            resolve(response);
        })

        addToStorage();
        resolve(true);
    });
}
