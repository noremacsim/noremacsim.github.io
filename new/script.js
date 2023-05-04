$(document).ready(function () {
    buildAppTabs();
});

function buildAppTabs() {
    const stream = window.stream;
    const games = window.game;
    const browse = window.browse;
    const social = window.social;
    const cloudgames = window.cloudgames;
    const music = window.music;

    // Build Stream Apps
    if (social.length > 0) {
        for (const element of social) {
            $('#socialHTML').append(addBlock(element[0], element[1], element[3], element[4]));
        }
    } else {
        $('#tabsocial').hide();
    }

    // Build Stream Apps
    if (cloudgames.length > 0) {
        for (const element of cloudgames) {
            $('#cloudgamesHTML').append(addBlock(element[0], element[1], element[3], element[4]));
        }
    } else {
        $('#tabcloudgames').hide();
    }

    // Build Stream Apps
    if (music.length > 0) {
        for (const element of music) {
            $('#musicHTML').append(addBlock(element[0], element[1], element[3], element[4]));
        }
    } else {
        $('#tabmusic').hide();
    }


    // Build Stream Apps
    if (stream.length > 0) {
        for (const element of stream) {
            $('#streamHTML').append(addBlock(element[0], element[1], element[3], element[4]));
        }
    } else {
        $('#tabStream').hide();
    }

    // Build Game Apps
    if (games.length > 0) {
        for (const element of games) {
            $('#gameHTML').append(addBlock(element[0], element[1], element[3], element[4]));
        }
    } else {
        $('#tabGame').hide();
    }

    // Build Browse Apps
    if (browse.length > 0) {
        for (const element of browse) {
            $('#browseHTML').append(addBlock(element[0], element[1], element[3], element[4]));
        }
    } else {
        $('#tabBrowse').hide();
    }
}

function addBlock(title, link, image, drive) {
    return `
    <div class="d-inline-flex position-relative p-2" onclick="navigate('${link}', '${title}')">
        <img class="rounded-9 shadow-4" src="${image}" alt="${title}" style="width: 125px; height: 125px;">
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
    gtag('event', 'click', {
        event_category: 'click',
        event_action: 'Click',
        event_label: title
    });

    window.location = link;
}
