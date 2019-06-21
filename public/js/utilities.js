export function formatDropboxRawLinks(url)  {
  // This is the path to downloadable dropbox assets. Cannot have dl=0 & must be the user content URL.
  // This allows for simple hosting for low traffic assets. Higher traffic assets would need to be hosted elsewhere.
  return url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com').replace('?dl=0', '');
}
