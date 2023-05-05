$(document).ready(function () {
    getFromStorage();
    if (window.newversion_a === null) {
        $('#helpModal').modal('show');
        localStorage.setItem(`${window.version}-pop`, 'true');
    }
});

function buildAppTabs() {
    const stream = window.stream;
    const games = window.game;
    const browse = window.browse;

    $('#streamHTML').html('');
    $('#gameHTML').html('');
    $('#browseHTML').html('');

    // Build Stream Apps
    let streamIndex = 0;
    if (stream.length > 0) {
        for (const element of stream) {
            $('#streamHTML').append(addBlock(element[0], element[1], element[3], streamIndex, 'stream'));
            streamIndex++;
        }
    } else {
        $('#tabStream').hide();
    }

    // Build Game Apps
    let gameIndex = 0;
    if (games.length > 0) {
        for (const element of games) {
            $('#gameHTML').append(addBlock(element[0], element[1], element[3], gameIndex, 'game'));
            gameIndex++;
        }
    } else {
        $('#tabGame').hide();
    }

    // Build Browse Apps
    let browseIndex = 0;
    if (browse.length > 0) {
        for (const element of browse) {
            $('#browseHTML').append(addBlock(element[0], element[1], element[3], browseIndex, 'browse'));
            browseIndex++;
        }
        let search = `
            <div class="d-inline-flex position-relative p-2" data-mdb-toggle="modal" data-mdb-target="#searchModal">
                <img class="rounded-9 shadow-4" src="https://images-eds-ssl.xboxlive.com/image?url=rOOPPWX9ohGfLksSzq1Wig8iTZ05uPbeb.DpV4tdbbbWNm1XXu8uEEIOyHxIQzbkg6QV19S8ccQ3rJJvQNmSUn_TC6y.r4fl_f9KOa1NN_xM_dIQYqurJp4Hx5.6pahDol7yzO6kUj5dDpUHeMO8DeUy4j1j3nWAb3FpbQDy62HqNt5tJA0oumeD.AUXipL0nv4zVEIvmPNRCpXAvcHAbPOseEO1d2lZRQuCAcZx5PzYaJwzPkskEea.PaAFnZB5kF_n8MfizglWus42hA4uvITSxw87Ms9MK99SID90opDn9szswm3koPJ.FRA_I_tR&format=source&w=120" alt="Search" style="width: 100px; height: 100px;">
            </div>`;

        $('#browseHTML').prepend(search);
    } else {
        $('#tabBrowse').hide();
    }

    //Paypal Donate
    let paypalHtml = `
    <div class="d-inline-flex position-relative p-2" onclick="navigate('https://www.paypal.com/donate/?hosted_button_id=RAFQ4WLY2NX62', 'Donate')">
        <img class="rounded-9 shadow-4" src="https://www.littlewings.org.au/wp-content/uploads/bb-plugin/cache/72-727103_paypal-donate-button-png-transparent-png-200x200-square.png" alt="Donate" style="width: 100px; height: 100px;">
    </div>
    `;
    $('#browseHTML').append(paypalHtml);
    $('#streamHTML').append(paypalHtml);
    $('#gameHTML').append(paypalHtml);


    $('#streamHTML').append(`
        <div class="d-inline-flex position-relative p-2 newAppModalButton" data-type="stream">
            <img class="rounded-9 shadow-4" src="https://static.thenounproject.com/png/953211-200.png" alt="Search" style="width: 100px;height: 100px;background: #c1c1c1;border: 1px solid black;">
        </div>
    `);

    $('#gameHTML').append(`
        <div class="d-inline-flex position-relative p-2 newAppModalButton" data-type="game">
            <img class="rounded-9 shadow-4" src="https://static.thenounproject.com/png/953211-200.png" alt="Search" style="width: 100px;height: 100px;background: #c1c1c1;border: 1px solid black;">
        </div>
    `);

    $('#browseHTML').append(`
        <div class="d-inline-flex position-relative p-2 newAppModalButton" data-type="browse">
            <img class="rounded-9 shadow-4" src="https://static.thenounproject.com/png/953211-200.png" alt="Search" style="width: 100px;height: 100px;background: #c1c1c1;border: 1px solid black;">
        </div>
    `);

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
    const stream = window.stream;
    const games = window.game;
    const browse = window.browse;

    localStorage.setItem("stream", JSON.stringify(stream));
    localStorage.setItem("game", JSON.stringify(games));
    localStorage.setItem("browse", JSON.stringify(browse));
    buildAppTabs();
}

function resetData() {
    window.stream = window.core.stream;
    window.game = window.core.game;
    window.browse = window.core.browse;
    addToStorage();
    location.reload();
}

async function getFromStorage() {
    return new Promise((resolve, reject) => {
        if ("stream" in localStorage) {
            window.stream = JSON.parse(localStorage.getItem("stream"));
        } else {
            window.stream = window.core.stream;
        }

        if ("game" in localStorage) {
            window.game = JSON.parse(localStorage.getItem("game"));
        } else {
            window.game = window.core.game;
        }

        if ("browse" in localStorage) {
            window.browse = JSON.parse(localStorage.getItem("browse"));
        } else {
            window.browse = window.core.browse;
        }

        addToStorage();
        resolve(true);
    });
}

function saveCustom(title, link, type) {
    let app = [title, link, true, createAppImage(title), false];

    if (type === 'stream') {
        window.stream.push(app);
    } else if (type === 'game') {
        window.game.push(app);
    } else if (type === 'browse') {
        window.browse.push(app);
    }
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
        window.stream.splice(index, 1);
    } else if (type === 'game') {
        window.game.splice(index, 1);
    } else if (type === 'browse') {
        window.browse.splice(index, 1);
    }

    $(`#${type}-${index}`).remove();
});

$(document.body).on('tap', '.newAppModalButton', function(e) {
    e.preventDefault();
    let type = $(this).attr("data-type");
    $('#newSiteType').val(type);
    $('#newAppModal').modal('show');
});
