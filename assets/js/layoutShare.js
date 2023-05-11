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
        };

        $.ajax(settings).done(async function (response, data) {
            if (response.status === false) {
                await idNotFound();
            }
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
            resolve(response['data']);
        })
    });
}

async function addNewApp(data) {
    return new Promise(async (resolve, reject) => {
        const name = window.appId;

        let settings = {
            "url": `${apiUrl}/app/new?id=${name}`,
            "method": "POST",
            "timeout": 0,
            "data": JSON.stringify(data),
        };

        $.ajax(settings).done(async function (response, data) {
            resolve(response);
        })
    });
}

async function deleteApp(id) {
    return new Promise(async (resolve, reject) => {
        const name = window.appId;

        let settings = {
            "url": `${apiUrl}/app/delete?uid=${name}&id=${id}`,
            "method": "POST",
            "timeout": 0
        };

        $.ajax(settings).done(async function (response, data) {
            return resolve(response);
        })
        resolve(true);
    });
}

function submitFeedBack(feedback, rating) {
    $('#feedBackModal').modal('hide');

    return new Promise(async (resolve, reject) => {
        const name = window.appId;

        let settings = {
            "url": `${apiUrl}/user/feedback?name=${name}&rating=${rating}`,
            "method": "POST",
            "timeout": 0,
            "data": feedback,
        };

        $.ajax(settings).done(async function (response, data) {
            resolve(response);
        })

        resolve(true);
    });
}

async function idNotFound() {
    Swal.fire({
        title: 'SimFlixID Not Found',
        text: "Hey this simFlixID doesn't exist. Lets create a new one",
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Generate New ID'
    }).then((result) => {
        if (result.isConfirmed) {
            resetData();
            Swal.fire(
                'Created!',
                'Your ID Has been generated.',
                'success'
            )
        }
    })
}

