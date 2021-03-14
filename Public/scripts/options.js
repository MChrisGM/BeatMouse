//----------------------Load & Save Game Options-------------------------------------
function loadOptions() {
  if (localStorage.getItem('options') != null) {
    options = JSON.parse(localStorage.getItem('options'));
    if (options['app_version'] < version) {
      options = default_options;
    } else if (options['app_version'] > version) {
      console.error("Outdated client! Try refreshing the page.");
    }
  } else {
    options = default_options;
  }
  saveOptions();
}

function saveOptions() {
  localStorage.setItem('options', JSON.stringify(options));
}
//----------------------------------------------------------------------------------------