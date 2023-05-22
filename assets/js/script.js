$(document).ready(async function () {
    await startApp();
});

const delay = ms => new Promise(res => setTimeout(res, ms));

async function startApp() {
    let appId = await getAppID();

    if (appId === '') {
        await createAppID()

        for (const starterApp of starterApps) {
            await saveCustom(starterApp[0], starterApp[1], starterApp[3]);
        }

        appId = window.appId;
    }

    $('#yourcode').html(`Your Code: ${appId}`);

    await delay(1000);

    await getLayoutShare(appId).then(async data => {
        buildAppTabs(data['apps']);
        if (data['visits'] >= 3) {
            if (data['submittedFeedback'] === false) {
                $('#feedBackModal').modal('show');
            }
        }
    });

    $('.loaded').show();
    $('.loading').hide();
}

function submitRating(rating) {
    $('#feedbackRating').val(rating);
    $('#emojiRate').hide();
    $('#feedbackComment').show();
}

async function getAppID() {
    return new Promise(async (resolve, reject) => {
        if (window.appId !== '' && window.appId != null) {
            localStorage.setItem("appId", window.appId);
            await setCookie('appId', window.appId, 365);
            resolve(window.appId);
        } else if ("appID" in localStorage) {
            window.appId = localStorage.getItem("appID");
            await setCookie('appId', window.appId, 365);
            resolve(window.appId);
        } else if (getCookie('appId') !== '') {
            window.appId = await getCookie('appId');
            localStorage.setItem("appId", appId);
            resolve(window.appId);
        }
        resolve('');
    });
}

async function createAppID() {

    return new Promise(async (resolve, reject) => {
        await createLayoutShareId().then(async data => {
            window.appId = data.uniqueID;
            localStorage.setItem("appId", data.uniqueID);
            await setCookie('appId', data.uniqueID, 365);
        });
        resolve(true);
    });
}

function buildAppTabs(apps) {
    let userApps = $('#userHTML');

    $('.appId').val(window.appId);
    userApps.html('');

    if (apps.length > 0) {
        for (const app of apps) {
            userApps.append(addBlock(app['id'], app['name'], app['image'], app['url']));
        }
    }

    if (apps.length < window.maxApps) {
        $(`#userHTML`).append(`
                <div class="d-inline-flex position-relative p-2 newAppModalButton">
                    <div class="newAppIcon rounded-9 userAppStyle">
                        <i class="fa fa-plus newAppIconPlus" aria-hidden="true"></i>
                    </div>
                </div>
            `);
    }
}

function addBlock(id, name, image, url) {
    return `
    <div id="${id}-userApp" class="d-inline-flex position-relative p-2 appLink" data-link='${url}' data-title='${name}')">
        <img class="deleteApp" data-id='${id}' src="https://www.transparentpng.com/thumb/red-cross/dU1a5L-flag-x-mark-clip-art-computer-icons.png">
        <img class="rounded-9 shadow-4 appsImage userAppStyle" src="${image}" alt="${name}" style="width: 100px; height: 100px;">
    </div>`;
}

function navigate(link, title) {
    if (!link.match(/^[a-zA-Z]+:\/\//))
    {
        link = 'https://' + link;
    }

    gtag('event', 'click', {
        event_category: 'click',
        event_action: 'Click',
        event_label: title
    });

    window.location = link;
}

async function resetData() {
    await createAppID()
    for (const starterApp of starterApps) {
        await saveCustom(starterApp[0], starterApp[1], starterApp[3]);
    }
    await startApp();
}

async function saveCustom(title, link, imageUrl) {

    let image = imageUrl;
    if (imageUrl === '') {
        image = createAppImage(title);
    }

    let app = {'name': title, 'url': link, 'image': image};

    await addNewApp(app).then(data => {
        $(addBlock(data['data']['id'], title, image, link)).insertBefore($( ".newAppModalButton" ));
    });
    $('#newAppModal').modal('hide');
}

function createAppImage(title) {
    let canvas = document.getElementById("myCanvas");
    canvas.height = 100
    canvas.width  = 100
    let ctx = canvas.getContext("2d");

    let colors = ['red', 'orange', 'yellow', 'lime', 'green', 'teal', 'blue', 'purple'];

    let randomNumber = Math.floor(Math.random()*colors.length);
    let randomNumber2 = Math.floor(Math.random()*colors.length);

    //when the 2 random Numbers equal the same it creates another randomNumber2
    if (randomNumber === randomNumber2) {
        randomNumber2 = randomNumber+1;
    } else if(randomNumber === 7 && randomNumber2 === 7){
        randomNumber2 = randomNumber-1;
    };

    fillColor = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    fillColor.addColorStop(0, colors[randomNumber]);
    fillColor.addColorStop(1, colors[randomNumber2]);
    ctx.fillStyle=fillColor;
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = 'white';
    ctx.fillText(title, canvas.width/2, canvas.height/2);
    return canvas.toDataURL('image/jpeg');
}

async function cancelDeletes() {
    $('.deleteApp').hide(200);
    $('.apptabs').show(200);
    $('.canceltabs').hide(200);
}

async function importAppList(id) {
    await getLayoutShare(id).then(async data => {
        Swal.fire({
            icon: 'success',
            text: 'Successfully Imported App List',
            target: 'body',
            // toast: true,
            position: 'center',
            timer: 3000,
            allowOutsideClick: true,
            showConfirmButton: false
        });

        window.appId = id;
        localStorage.setItem("appId", id);
        await setCookie('appId', id, 365);

        buildAppTabs(data['apps']);

        if (data['visits'] >= 3) {
            if (data['submittedFeedback'] === false) {
                $('#feedBackModal').modal('show');
            }
        }
    });
}

function updateexampleLogoImage() {
    if ($('#newSiteImageUrl').val()) {
        $('#myCanvas').hide();
        $('#imageLogoExample').show();
        $('#imageLogoExample').css('display', 'block');
        $("#imageLogoExample").attr("src", $('#newSiteImageUrl').val());
    } else {
        createAppImage($('#newSiteTitle').val());
        $('#imageLogoExample').hide();
        $('#myCanvas').show();
        $('#myCanvas').css('display', 'block');
    }
}

function populateNewAppModel(type) {

    let index = 0;
    $('#newAppList').html('');
    if (coreApps.length > 0) {
        for (const element of coreApps) {
            $('#newAppList').append(`
            <div id="${index}-app" class="d-inline-flex position-relative p-2 addApp" data-image='${element[3]}' data-link='${element[1]}' data-title='${element[0]}')">
                <img class="rounded-9 shadow-4" src="${element[3]}" alt="${element[0]}" style="width: 75px; height: 75px;">
            </div>`
            );
            index++;
        }
    }
}

$(document.body).on('taphold', '.appLink', function(e) {
    e.preventDefault();
    window.removeApps = [];
    $('.deleteApp').show(200);
    $('.apptabs').hide(200);
    $('.canceltabs').show(200);
});

$(document.body).on('tap', '.appLink', function(e) {
    e.preventDefault();
    if($('.deleteApp').is(":visible")) {
        return false;
    }

    let link = $(this).attr("data-link");
    let title = $(this).attr("data-title");
    navigate(link, title);
});

$(document.body).on('tap', '.addApp', function(e) {
    e.preventDefault();
    let link = $(this).attr("data-link");
    let title = $(this).attr("data-title");
    let image = $(this).attr("data-image");
    saveCustom(title, link, image);
});

$(document.body).on('tap', '.deleteApp', async function (e) {
    e.preventDefault();
    let id = $(this).attr("data-id");
    await deleteApp(id);
    $(`#${id}-userApp`).remove();
});

$(document.body).on('tap', '.newAppModalButton', function(e) {
    e.preventDefault();
    let type = $(this).attr("data-type");
    $('#newSiteType').val(type);
    $('#newAppModal').modal('show');
    populateNewAppModel(type);
});

$(document.body).on('tap', '#importCode', async function (e) {
    e.preventDefault();
    $('#appCode').hide();
    $('#cancelImport').show();
    $('#importCode').hide();
    $('.currentAppIdCode').hide();
    $('#importInput').show();
});

$(document.body).on('tap', '#cancelImport', async function (e) {
    e.preventDefault();
    $('#appCode').show();
    $('#cancelImport').hide();
    $('#importCode').show();
    $('.currentAppIdCode').show();
    $('#importInput').hide();
});

$('#newSiteTitle').on('keyup change', function() {
    updateexampleLogoImage();
});

$('#newSiteImageUrl').on('keyup change', function() {
    updateexampleLogoImage();
});

$(document).tap(function(e) {
    let item = $(".deleteApp");
    if (!item.is(e.target) && item.has(e.target).length === 0)
    {
        if ($(".deleteApp").is(":visible")) {
            cancelDeletes();
        }
    }
});

$('#color').on('change tap keyup keydown',function() {
    updateBackground($('#color').val());
});

function shareSite()
{
    if (navigator.share) {
        navigator.share({
            title: "SimFlix Bookmark App Manger for Cars, Tv's and more",
            text: 'Hey, I have organised my own SimFlix Space Check it out!',
            url: `https://noremacsim.github.io`,
        })
            .then(data => {
                console.log('done');
            })
            .catch((error) => console.log('Error sharing', error));
    } else {
        console.log('Share not supported on this browser, do it the old way.');
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function setCookie(cname, cvalue, exdays) {
    return new Promise(async (resolve, reject) => {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        resolve(true);
    })
}

function deleteCookie(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function saveBaseUrl ()  {
    var file = document.querySelector('input[type=file]')['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
        baseString = reader.result;
        window.user.settings.profileImage = baseString;
    };
    reader.readAsDataURL(file);
}

function saveBackgroundImage() {
    var file = document.querySelector('.backgroundImageUpload')['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
        baseString = reader.result;
        window.user.settings.background = `url('${baseString}')`;
        $('#currentBackgroundImage').show();
        $('#currentBackgroundImage').attr('src', baseString);
    };
    reader.readAsDataURL(file);
}

function chooseBackgroundImage() {
    $('#color').hide();
    $('#backgroundimagecontainer').show();

    let background = window.user.settings.background;
    let parts = background.split('"');

    if (parts.length > 1) {
        if (parts[1].includes('base64')) {
            $('#currentBackgroundImage').show();
            $('#currentBackgroundImage').attr('src', parts[1]);
        }
    }
}

function chooseBackgroundColor() {
    $('#color').show();
    $('#backgroundimagecontainer').hide();
}
