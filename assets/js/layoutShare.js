const apiUrl = 'https://simflix.online';

async function generateLayoutShare(name) {
    return new Promise(async (resolve, reject) => {
        if ("apps" in localStorage) {
            if (JSON.parse(localStorage.getItem("apps")).length < 1) {
                resolve('ERROR')
            } else {
                window.apps = JSON.parse(localStorage.getItem("apps"));
            }

            let settings = {
                "url": `${apiUrl}/create.php?name=${name}`,
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(window.apps),
            };

            $.ajax(settings).done(function (response, data) {
                resolve(response);
            });
        }
    });
}

async function getLayoutShare(code) {
    return new Promise(async (resolve, reject) => {
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
        });
    });
}

function createShareKey(length) {
    let result = '';
    const characters = 'ABCDEFGHKMNOPQRSTUVWXYZabcdefghmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
