const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const usuarioLabel = document.getElementById("usuario");
const usuarioImagen = document.getElementById("usuarioImagen");
const IngresoForm = document.getElementById("IngresoForm");
var myStorage = window.localStorage;

window.onload = (event) => {
  fs.collection("libros")
    .get()
    .then((snapshot) => {
      traerLibros(snapshot.docs);
    });
};

//Verificar Login
const verificarLogin = (usario) => {
  if (usario) {
    loggedInLinks.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));
  } else {
    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
  }
};

//Registrar Usuario
const registroForm = document.getElementById("RegistroForm");
const RegistroModal = new bootstrap.Modal(
  document.getElementById("RegistroModal"),
  {
    keyboard: false,
  }
);
const IngresoModal = new bootstrap.Modal(
  document.getElementById("IngresoModal"),
  {
    keyboard: false,
  }
);

registroForm.addEventListener("submit", () => {
  const Correo = document.getElementById("Registro-Correo").value;
  const Password = document.getElementById("Registro-Password").value;

  auth
    .createUserWithEmailAndPassword(Correo, Password)
    .then((userCredential) => {
      // clear the form
      registroForm.reset();
      // close the modal
      RegistroModal.hide();
    });
});

// Correo Login

IngresoForm.addEventListener("submit", () => {
  const Correo = document.getElementById("Ingreso-Correo").value;
  const Password = document.getElementById("Ingreso-Password").value;

  // Authenticate the User
  auth
    .signInWithEmailAndPassword(Correo, Password)
    .then((userCredential) => {
      // clear the form
      console.log(user);
      var user = userCredential.user;
      myStorage.setItem("email", user.email);
      myStorage.setItem("user", user.email);
      myStorage.setItem("uid", user.uid);
      myStorage.setItem("userFoto", "images/avatar.png");
      // close the modal
      IngresoModal.hide();
    })
    .catch((err) => {
      console.log(err);
    });
});

// Twitter Login
const botonFacebook = document.getElementById("twitterLogin");
botonFacebook.addEventListener("click", () => {
  const provider = new firebase.auth.TwitterAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      var user = result.user;
      myStorage.setItem("email", "twitter");
      myStorage.setItem("user", user.displayName);
      myStorage.setItem("uid", user.uid);
      myStorage.setItem("userFoto", user.photoURL);
      IngresoModal.hide();
    })
    .catch((err) => {
      console.log(err);
    });
});

// Google Login
const botonGoogle = document.getElementById("googleLogin");
botonGoogle.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      var user = result.user;
      myStorage.setItem("email", user.email);
      myStorage.setItem("user", user.displayName);
      myStorage.setItem("uid", user.uid);
      myStorage.setItem("userFoto", user.photoURL);
      IngresoModal.hide();
    })
    .catch((err) => {
      console.log(err);
    });
});

//Cerrar Sesion
const botonCerrar = document.getElementById("cerrarSesion");
botonCerrar.addEventListener("click", () => {
  auth.signOut().then(() => {
    myStorage.clear();
    fs.collection("libros")
      .get()
      .then((snapshot) => {
        traerLibros(snapshot.docs);
      });
  });
});

//Listar Libros
const tabla = document.getElementById("libroContainer");
const traerLibros = (data) => {

  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      if (doc.data().uid ==  myStorage.getItem("uid")) {
        const libro = doc.data();
        libro.id = doc.id;
        const tr = `         
          <div class="card mb-3" style="max-width: 800px;">
            <div class="row no-gutters">
              <div class="col-md-3">
                <img src="${libro.imagenUrl}" width='180px' height='250px'>
              </div>
              <div class="col-md-9">
                <div class="card-body">
                  <h5 class="card-title">${libro.Titulo}</h5>
                  <p class="card-text"><small class="text-muted">Autor: ${libro.Autor}</small></p>
                  <p class="card-text"><small class="text-muted">Género: ${libro.Genero}</small></p>
                  <p class="card-text">Publicado: ${libro.Publicado}</p>
                  <p class="card-text">Páginas: ${libro.Paginas}</p>
                  <p class="card-text">Resumen: ${libro.Sinopsis}</p>
                </div>
                <div class="row card-body">
                  <div class="col-10">
                  <a href='${libro.pdfUrl}' class="card-link"><i class="fas fa-file-pdf"></i></a>
                  </div>
                  <div class="col-2">
                  <button type="button" class="btn btn-danger btn-delete" data-id="${libro.id}">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr>
          `;
        html += tr;
      } 
      else if (myStorage.length == 0) {
        const libro = doc.data();
        libro.id = doc.id;
        const tr = `         
          <div class="card mb-3" style="max-width: 800px;">
            <div class="row no-gutters">
              <div class="col-md-3">
                <img src="${libro.imagenUrl}" width='180px' height='250px'>
              </div>
              <div class="col-md-9">
                <div class="card-body">
                  <h5 class="card-title">${libro.Titulo}</h5>
                  <p class="card-text"><small class="text-muted">Autor: ${libro.Autor}</small></p>
                  <p class="card-text"><small class="text-muted">Género: ${libro.Genero}</small></p>
                  <p class="card-text">Publicado: ${libro.Publicado}</p>
                  <p class="card-text">Páginas: ${libro.Paginas}</p>
                  <p class="card-text">Resumen: ${libro.Sinopsis}</p>
                </div>
                <div class="card-body">
                  <a href='${libro.pdfUrl}' class="card-link"><i class="fas fa-file-pdf"></i></a>
                </div>
              </div>
            </div>
          </div>
          <hr>
          `;
        html += tr;
      } 
    });
    tabla.innerHTML = html;
    const btnsDelete = document.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        try {
          await deleteTask(e.target.dataset.id);
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      })
    );
  }
};

// Sesion y FireStore
auth.onAuthStateChanged((usuario) => {
  if (usuario) {
    fs.collection("libros")
      .get()
      .then((snapshot) => {
        traerLibros(snapshot.docs);
        usuarioLabel.innerHTML = "" + myStorage.getItem("user");
        usuarioImagen.src = myStorage.getItem("userFoto");
        verificarLogin(usuario);
      });
  } else {
    tabla.innerHTML = "";
    verificarLogin(usuario);
  }
});

//Subir Archivos

var subirImagen = (file, uid) => {
  const imagenesStorage = firebase
    .storage()
    .ref(`imagenes/${uid}/${file.name}`);
  const taskImagen = imagenesStorage.put(file);
  taskImagen.on(
    'state_changed',
    (snapshot) => {
      const porcentaje =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById("progressImagen").style.width = `${porcentaje}%`;
    },
    (err) => {alert(`Error subiendo la Imagen => ${err.message}`)},
    () => {
      taskImagen.snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          sessionStorage.setItem("imgNewPost", url);
        })
        .catch((err) => {
          alert(`Error obteniendo downlaodURL Imagen => ${err.message}`);
        });
    }
  );
};

var subirPdf = (file, uid) => {
  const pdfsStorage = firebase.storage().ref(`pdfs/${uid}/${file.name}`);
  const taskPdf = pdfsStorage.put(file);
  taskPdf.on(
    "state_changed",
    (snapshot) => {
      const porcentaje =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById("progressPdf").style.width = `${porcentaje}%`;
    },
    (err) => alert(`Error subiendo el Pdf => ${err.message}`),
    () => {
      taskPdf.snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          sessionStorage.setItem("pdfNewPost", url);
        })
        .catch((err) => {
          alert(`Error obteniendo downlaodURL Pdf => ${err.message}`);
        });
    }
  );
};

document.getElementById("formFileImagen").addEventListener("change", e => {
  const file = e.target.files[0];
  const user = firebase.auth().currentUser;
  subirImagen(file, user.uid);
})

document.getElementById("formFilePdf").addEventListener("change", e => {
  const file = e.target.files[0];
  const user = firebase.auth().currentUser;
  subirPdf(file, user.uid);
})

// Agregar Libros
const agregarLibroForm = document.getElementById("agregarLibroForm");
agregarLibroForm.addEventListener("submit", async () => {
  const Autor = agregarLibroForm["autor"].value;
  const Genero = agregarLibroForm["genero"].value;
  const Paginas = agregarLibroForm["paginas"].value;
  const Publicado = agregarLibroForm["publicado"].value;
  const Sinopsis = agregarLibroForm["sinopsis"].value;
  const Titulo = agregarLibroForm["titulo"].value;
  const imagenUrl = sessionStorage.getItem('imgNewPost') == 'null'  ? null : sessionStorage.getItem('imgNewPost')
  const pdfUrl = sessionStorage.getItem('pdfNewPost') == 'null'  ? null : sessionStorage.getItem('pdfNewPost')
  const uid = firebase.auth().currentUser.uid;
  const response = await fs.collection("libros").doc().set({
    Autor,
    Genero,
    Paginas,
    Publicado,
    Sinopsis,
    Titulo,
    imagenUrl,
    pdfUrl,
    uid
  });
  window.location.reload();
});

// Eliminar Libros
const deleteTask = (id) => fs.collection("libros").doc(id).delete();
