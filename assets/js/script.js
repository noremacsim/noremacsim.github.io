$(document).ready(async function () {
    await startApp();
});

const delay = ms => new Promise(res => setTimeout(res, ms));

async function startApp() {
    let appId = await getAppID();

    if (appId === '') {
        await createAppID()
        appId = window.appId;
    }

    await delay(1000);

    await getLayoutShare(appId).then(async data => {
        window.user = data;
        if (window.user.settings.feedbacksubmit == null || window.user.settings.feedbacksubmit === false) {
            window.user.settings.feedbacksubmit = false;
        }
        localStorage.setItem("user", JSON.stringify(window.user));
    });

    await getFromStorage().then(async data => {
        window.user.settings.visit++;
        await addToStorage();
    });

    updateStyles();

    $('.loaded').show();
    $('.loading').hide();

    if (window.user.settings.visit >= 3) {
        if (window.user.settings.feedbacksubmit == null || window.user.settings.feedbacksubmit === false) {
            window.user.settings.feedbacksubmit = true;
            $('#feedBackModal').modal('show');
        }
    }
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
        await createLayoutShareId().then(async appId => {
            window.user = {
                'apps': starterApps,
                'settings': {
                    'profileImage': '',
                    'background': '',
                    'iconStyle': '',
                    'visit': 0,
                    'feedbacksubmit': false,
                },
            };

            window.appId = appId;
            localStorage.setItem("appId", appId);
            await setCookie('appId', appId, 365);
            localStorage.setItem("user", JSON.stringify(window.user));
            return await saveLayout().then(async data => {
                resolve(data);
            });
        });
        resolve(true);
    });
}

function buildAllApps() {
    let index = 0;
    if (coreApps.length > 0) {
        for (const element of coreApps) {
            let appType = element[4];
            let appTab = $(`#${appType}HTML`);
            let allTab = $('#allHTML');
            let block = addBlock(element[0], element[1], element[3], index)
            appTab.append(block);
            allTab.append(block);
            index++;
        }
    }
}

function buildAppTabs() {
    let userApps = $('#userHTML');
    let index = 0;

    $('.appId').val(window.appId);
    userApps.html('');

    if (window.user.apps.length > 0) {
        for (const element of window.user.apps) {
            userApps.append(addBlock(element[0], element[1], element[3], index));
            index++;
        }
    }

    if (window.user.apps.length < window.maxApps) {
        $(`#userHTML`).append(`
                <div class="d-inline-flex position-relative p-2 newAppModalButton">
                    <div class="newAppIcon rounded-9 userAppStyle">
                        <i class="fa fa-plus newAppIconPlus" aria-hidden="true"></i>
                    </div>
                </div>
            `);
    }
    updateStyles();

}

function addBlock(title, link, image, index) {
    return `
    <div id="${index}-userApp" class="d-inline-flex position-relative p-2 appLink" data-link='${link}' data-title='${title}')">
        <img class="deleteApp" data-index='${index}' src="https://www.transparentpng.com/thumb/red-cross/dU1a5L-flag-x-mark-clip-art-computer-icons.png">
        <img class="rounded-9 shadow-4 appsImage userAppStyle" src="${image}" alt="${title}" style="width: 100px; height: 100px;">
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

async function addToStorage() {
    window.removeApps = [];
    localStorage.setItem("user", JSON.stringify(window.user));
    await saveLayout().then(data => {
        buildAppTabs();
    });
}

async function resetData() {
    await createAppID();
    await startApp();
    location.reload();
}

async function getFromStorage() {

    return new Promise(async (resolve, reject) => {
        if ("user" in localStorage) {
            if (JSON.parse(localStorage.getItem("user")).length < 1) {
                window.user.apps = starterApps;
            } else {
                window.user = await JSON.parse(localStorage.getItem("user"));
            }
        } else {
            window.user.apps = starterApps;
        }
        resolve(true);
    });
}

async function saveCustom(title, link, imageUrl) {

    let image = imageUrl;
    if (imageUrl == '') {
        image = createAppImage(title);
    }

    let app = [title, link, true, image, false];

    await getFromStorage();

    if (typeof window.user.apps == 'null') {
        window.user.apps = [];
    }

    window.user.apps.push(app);
    addToStorage();
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
    const filtered = window.user.apps.filter((value, index) => {
        return !window.removeApps.includes(index.toString());
    })
    window.user.apps = filtered;
    addToStorage();
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
        window.user = data;
        window.appId = id;
        localStorage.setItem("appId", id);
        await setCookie('appId', id, 365);
        addToStorage();
    })
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

$(document.body).on('tap', '.deleteApp', function(e) {
    e.preventDefault();
    let index = $(this).attr("data-index");
    window.removeApps.push(index);
    $(`#${index}-userApp`).remove();
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

function updateStyles() {
    let iconStyle = window.user.settings.iconStyle;
    let background = window.user.settings.background;
    let profileImage = window.user.settings.profileImage;

    if (iconStyle === 'circle') {
        $('.userAppStyle').addClass('appStylesCircle');
    } else if (iconStyle === 'rounded') {
        $('.userAppStyle').addClass('appStylesRounded');
    } else if (iconStyle === 'sqaure') {
        $('.userAppStyle').addClass('appStyleSqaure');
    }

    if (background !== '') {
        $('html').css({'background': background})
        $('body').css({'background': background})
    }

    if (profileImage !== '') {
        $('.userProfileImageSrc').attr("src",profileImage);
    }
}

function updateAppStyle(style) {
    window.user.settings.iconStyle = style;
    addToStorage();
}

function updateBackground(color) {
    window.user.settings.background = color;
    addToStorage();
}

function saveBaseUrl ()  {
    var file = document.querySelector('input[type=file]')['files'][0];
    var reader = new FileReader();
    var baseString;
    reader.onloadend = function () {
        baseString = reader.result;
        window.user.settings.profileImage = baseString;
        addToStorage();
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
        addToStorage();
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
