$(document).ready(async function () {

    await getFromStorage().then(data => {
        addToStorage();
    });

    if (window.newversion_a === null) {
        $('#helpModal').modal('show');
        localStorage.setItem(`${window.version}-pop`, 'true');
    }

});

function buildAppTabs() {
    for (let appType in window.apps) {
        let appTab = $(`#${appType}HTML`);
        appTab.html('');

        let index = 0;
        if (window.apps[appType].length > 0) {
            for (const element of window.apps[appType]) {
                appTab.append(addBlock(element[0], element[1], element[3], index, appType));
                index++;
            }

            appTab.append(`
                <div class="d-inline-flex position-relative p-2 newAppModalButton" data-type="${appType}">
                    <img class="rounded-9 shadow-4" src="https://static.thenounproject.com/png/953211-200.png" alt="Search" style="width: 100px;height: 100px;background: #c1c1c1;border: 1px solid black;">
                </div>
            `);

            appTab.append(`
                <div class="d-inline-flex position-relative p-2" onclick="navigate('https://www.paypal.com/donate/?hosted_button_id=RAFQ4WLY2NX62', 'Donate')">
                    <img class="rounded-9 shadow-4" src="https://www.littlewings.org.au/wp-content/uploads/bb-plugin/cache/72-727103_paypal-donate-button-png-transparent-png-200x200-square.png" alt="Donate" style="width: 100px; height: 100px;">
                </div>
            `);
        }
    }
}

function addBlock(title, link, image, index, type) {
    return `
    <div id="${type}-${index}" class="d-inline-flex position-relative p-2 appLink" data-link='${link}' data-title='${title}')">
        <img class="deleteApp" data-index='${index}' data-type='${type}' src="https://www.transparentpng.com/thumb/red-cross/dU1a5L-flag-x-mark-clip-art-computer-icons.png">
        <img class="rounded-9 shadow-4" src="${image}" alt="${title}" style="width: 100px; height: 100px;">
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

function addToStorage() {
    localStorage.setItem("apps", JSON.stringify(window.apps));
    buildAppTabs();
}

function resetData() {
    window.apps = coreApps;
    addToStorage();
    location.reload();
}

async function getFromStorage() {

    return new Promise(async (resolve, reject) => {
        if ("apps" in localStorage) {
            if (JSON.parse(localStorage.getItem("apps")).length < 1) {
                window.apps = coreApps;
            } else {
                window.apps = await JSON.parse(localStorage.getItem("apps"));
            }
        } else {
            window.apps = coreApps;
        }
        resolve(true);
    });
}

function saveCustom(title, link, type) {
    let app = [title, link, true, createAppImage(title), false];

    if (typeof window.apps[type] == "undefined") {
        window.apps[type] = [];
    }

    window.apps[type].push(app);
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

function cancelDeletes() {
    $('.deleteApp').hide(200);
    $('.apptabs').show(200);
    $('.canceltabs').hide(200);
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
        window.apps = data;
        addToStorage();
    })
}

$(document.body).on('taphold', '.appLink', function(e) {
    e.preventDefault();
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

$(document.body).on('tap', '.deleteApp', function(e) {
    e.preventDefault();
    let index = $(this).attr("data-index");
    let type = $(this).attr("data-type");

    if (type === 'stream') {
        window.apps.stream.splice(index, 1);
    } else if (type === 'game') {
        window.apps.game.splice(index, 1);
    } else if (type === 'browse') {
        window.apps.browse.splice(index, 1);
    }

    $(`#${type}-${index}`).remove();
});

$(document.body).on('tap', '.newAppModalButton', function(e) {
    e.preventDefault();
    let type = $(this).attr("data-type");
    $('#newSiteType').val(type);
    $('#newAppModal').modal('show');
});

$(document.body).on('tap', '#generateCode', async function (e) {
    e.preventDefault();
    let code = 'ERROR';

    $('#importInput').hide();
    $('#appCode').show();
    $('#appCode').prop("readonly", true);
    $('#appCode').css('background', 'transparent');


    await generateLayoutShare().then(data => {
        if (data !== 'ERROR') {
            const codeSplit = data.split("basket: ");
            code = codeSplit[1];
        }

        $('#appCode').val(code.slice(0, -1));
    });
});

$(document.body).on('tap', '#importCode', async function (e) {
    e.preventDefault();
    $('#appCode').hide();
    $('#importInput').show();
});
