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
            "url": `${apiUrl}/create.php?name=${name}`,
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
            "url": `${apiUrl}/get.php?name=${code}`,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
        };

        $.ajax(settings).done(function (response, data) {
            resolve(response);
        }).catch(error => {
            Swal.fire({
                icon: 'error',
                text: 'Failed, Please Check AppList ID',
                target: 'body',
                timer: 2000,
                allowOutsideClick: true,
            });
            location.reload();
            resolve(response);
        });
    });
}

function submitFeedBack(feedback) {
    $('#feedBackModal').modal('hide');

    return new Promise(async (resolve, reject) => {
        const name = window.appId;

        let settings = {
            "url": `${apiUrl}/feedback.php?name=${name}`,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": feedback,
        };

        $.ajax(settings).done(async function (response, data) {
            return resolve(response);
        })
        resolve(true);
    });
}
