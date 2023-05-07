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
        localStorage.setItem("user", JSON.stringify(window.user));
    });

    await getFromStorage().then(async data => {
        window.user.settings.visit++;
        await addToStorage();
        buildAllApps();
    });

    updateStyles();

    if (window.user.settings.visit === 4) {
        $('#feedBackModal').modal('show');
    }
}

async function getAppID() {
    return new Promise(async (resolve, reject) => {
        if (window.appId !== '') {
            localStorage.setItem("appId", appId);
            setCookie('appId', window.appId, 365);
            resolve(window.appId);
        } else if ("appID" in localStorage) {
            window.appId = localStorage.getItem("appID");
            setCookie('appId', window.appId, 365);
            resolve(window.appId);
        } else if (getCookie('appId') !== '') {
            window.appId = getCookie('appId');
            localStorage.setItem("appId", appId);
            resolve(window.appId);
        }
        resolve('');
    });
}

function loadAppID() {
    getLayoutShare(window.appId).then(data => {
        window.user = data;
    });
}

async function createAppID() {
    return new Promise(async (resolve, reject) => {
        await createShareKey(7).then(async appId => {
            setCookie('appId', appId, 365);
            localStorage.setItem("appId", appId);
            window.appId = appId;
            window.user.apps = starterApps;
            localStorage.setItem("user", JSON.stringify(window.user));
            return await saveLayout().then(async data => {
                resolve(data);
            });
        });
    });

}

async function createShareKey(length) {
    return new Promise(async (resolve, reject) => {
        let result = '';
        const characters = 'ABCDEFGHKMNOPQRSTUVWXYZabcdefghmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        resolve(result);
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

        // if (appType !== 'user') {
        //     appTab.append(`
        //         <div class="d-inline-flex position-relative p-2 newAppModalButton" data-type="${appType}">
        //             <img class="rounded-9 shadow-4" src="https://static.thenounproject.com/png/953211-200.png" alt="Search" style="width: 100px;height: 100px;background: #c1c1c1;border: 1px solid black;">
        //         </div>
        //     `);
        //
        //     appTab.append(`
        //         <div class="d-inline-flex position-relative p-2" onclick="navigate('https://www.paypal.com/donate/?hosted_button_id=RAFQ4WLY2NX62', 'Donate')">
        //             <img class="rounded-9 shadow-4" src="https://www.littlewings.org.au/wp-content/uploads/bb-plugin/cache/72-727103_paypal-donate-button-png-transparent-png-200x200-square.png" alt="Donate" style="width: 100px; height: 100px;">
        //         </div>
        //     `);
        // }
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

    // $(`#userHTML`).append(`
    //     <div id="appDrawer" class="d-inline-flex position-relative p-2 appLink" onclick="showAllApps()">
    //         <img class="rounded-9 shadow-4 appsImage userAppStyle" src="data:image/png;base64,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" alt="appDrawer" style="width: 100px; height: 100px;border: 3px solid white;padding: 10px;">
    //     </div>`
    // );

    updateStyles();

}

function showAllApps() {
    return;
    $('.allAppsContainer').show();
    $('#userHTML').hide();
    $('.headerProfile').hide();
}

function addBlock(title, link, image, index) {
    return `
    <div id="${index}-userApp" class="d-inline-flex position-relative p-2 appLink" data-link='${link}' data-title='${title}')">
        <img class="deleteApp" data-index='${index}' src="https://www.transparentpng.com/thumb/red-cross/dU1a5L-flag-x-mark-clip-art-computer-icons.png">
        <img class="rounded-9 shadow-4 appsImage userAppStyle" src="${image}" alt="${title}" style="width: 100px; height: 100px;">
    </div>`;
}

function openTab(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
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

function saveCustom(title, link, imageUrl) {

    let image = imageUrl;
    if (imageUrl == '') {
        image = createAppImage(title);
    }

    let app = [title, link, true, image, false];

    if (typeof window.user.apps == "undefined") {
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
        setCookie('appId', id, 365);
        localStorage.setItem("appId", id);
        window.appId = id;
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

$(document.body).on('tap', '#generateCode', async function (e) {
    e.preventDefault();
    // let code = 'ERROR';
    // const name = createShareKey(7);
    //
    // $('#importInput').hide();
    // $('#appCode').show();
    // $('#appCode').prop("readonly", true);
    // $('#appCode').css('background', 'transparent');
    // $('#appCode').val(name);
    //
    // await generateLayoutShare(name).then(data => {
    // });
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
        $('.deleteApp').hide(200);
        cancelDeletes();
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

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
