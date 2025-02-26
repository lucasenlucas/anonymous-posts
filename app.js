// Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyBHDtBS4Nk7-GUkMaSwqxPst5Lf67zGfSQ",
  authDomain: "anonymous-posts---test.firebaseapp.com",
  projectId: "anonymous-posts---test",
  storageBucket: "anonymous-posts---test.firebasestorage.app",
  messagingSenderId: "71078745276",
  appId: "1:71078745276:web:9ad19f119c50bd788eacb9"
};

// Initialiseer Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Google Inloggen
const provider = new firebase.auth.GoogleAuthProvider();

function googleLogin() {
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      document.getElementById("loginStatus").innerHTML = "Ingelogd als: " + user.displayName;
      window.location.href = 'dashboard.html'; // Stuur naar het dashboard na inloggen
    })
    .catch((error) => {
      alert("Inlogfout: " + error.message);
    });
}

// Berichten ophalen
function loadPosts() {
  const postsDiv = document.getElementById("posts");
  db.collection("posts").orderBy("timestamp", "desc").get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const postDiv = document.createElement("div");
        postDiv.innerHTML = `
          <h3>${data.title}</h3>
          <p>${data.message}</p>
          <p><small>Geplaatst op: ${new Date(data.timestamp.seconds * 1000).toLocaleString()}</small></p>
        `;
        postsDiv.appendChild(postDiv);
      });
    });
}

// Bericht plaatsen
function postMessage() {
  const title = document.getElementById("title").value;
  const message = document.getElementById("message").value;

  if (title && message) {
    db.collection("posts").add({
      title: title,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      alert("Bericht geplaatst!");
      window.location.href = 'index.html'; // Terug naar de homepage na plaatsen
    }).catch((error) => {
      alert("Fout bij plaatsen bericht: " + error.message);
    });
  }
}
