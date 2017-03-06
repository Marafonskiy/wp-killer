;(function() {
  "use strict";

  const quill = new Quill('#post-editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['link', 'image'],
        ['clean']
      ]
    }
  });

  var toolbar = quill.getModule('toolbar');
  toolbar.addHandler('image', showImageUI);

  function showImageUI(...args) {
    console.log(args);
    let form = document.createElement("form");
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.name = "post-image";

    form.appendChild(input);

    input.addEventListener("change", onFileSelect);

    let ev = new MouseEvent("click");
    input.dispatchEvent(ev);

    function onFileSelect(ev) {
      let input = ev.target;

      uploadFile(form);
      
      input.removeEventListener("change", onFileSelect);
    }
  }

  function uploadFile(form) {
    let formData = new FormData(form);

    // formData.append(input.name, input.files[0]);
    fetch("/upload-image", {
      method: "POST",
      body: formData
      // headers: {
      //   "Content-Type": "multipart/form-data; boundary=------WebKitFormBoundaryHGACx6KaO4p7psfG;"
      // }
    }).
    then(res => res.json()).
    then(res => {
      console.log(res);
      let url = res.data,
        i = quill.getSelection().index;

      quill.insertEmbed(i, "image", url);
    }).
    catch(e => {
      console.log(e);
    });
  }

  const uploadImage = (ev) => {
    const form = document.querySelector("#post-preview"),
          input = form.querySelector("#post-thumbnail");

    if(input.files.length < 1) throw new Error("Upload PREVIEW!!!");
    const formData = new FormData(form);


    const settings = {
      method: "POST",
      body: formData
    }

    return fetch("upload-thumb", settings).
      then((res) => res.json()).
      catch(e => console.error(e));
  };

  const saveButton = document.querySelector("#save-post");
  const savePost = () => {
    let content = document.querySelector("#post-editor .ql-editor").innerHTML;
    let title = document.querySelector("#post-title").value.trim();

    if(title.length < 1) return;

    console.log(content);

    uploadImage().
      then(({ data }) => fetch("post", {
        method: "POST",
        body: JSON.stringify({ content, title, thumb: data }),
        headers: {
          "Content-Type": "application/json"
        }
      })).
      then(res => res.json()).
      then(res => {
        console.log(res);
        // let url = res.data,
        //   l = quill.getLength();

        // quill.insertEmbed(l, "image", url);
      }).
      catch(e => {
        console.error(e);
      });
  };

  saveButton.addEventListener("click", savePost);
})();
















