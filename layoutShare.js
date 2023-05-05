const pantryUrl = 'https://getpantry.cloud/apiv1'
const pantryUid = '3ee32a9d-fde4-448c-afd3-049fd20e2b77';

async function generateLayoutShare() {
    return new Promise(async (resolve, reject) => {

        const name = createShareKey(7);
        let type = stream;

        if ("apps" in localStorage) {
            if (JSON.parse(localStorage.getItem("apps")).length < 1) {
                resolve('ERROR')
            } else {
                window.apps = JSON.parse(localStorage.getItem("apps"));
            }

            let settings = {
                "url": `${pantryUrl}/pantry/${pantryUid}/basket/${name}`,
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
            "url": `${pantryUrl}/pantry/${pantryUid}/basket/${code}`,
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
