(() => {
// セキュリティチェック
  'use strict';

  // Initialize Firebase
  const config = {
    authDomain: "fun-uploader.firebaseapp.com",
    databaseURL: "https://fun-uploader.firebaseio.com",
    projectId: "fun-uploader",
    storageBucket: "fun-uploader.appspot.com",
    messagingSenderId: "823374356210",
  };
  firebase.initializeApp(config);
  const message = document.getElementById('message');
  const explain = document.getElementById('explain');
  // formインスタンスを定義
  const form = document.querySelector('form');
  // setfileインスタンスを作成
  const setfile = document.getElementById("setfile");
  // CloudStorageインスタンスを作成
  const storage = firebase.storage();
  // imgSampleインスタンスを作成
  // const imgSample = document.getElementById("imgSample");
  const db = firebase.firestore();
  const collection = db.collection('mdata');
  const pictures = document.getElementById('pictures');
  const auther = document.getElementById('auther');


  // グローバル変数を定義
  var file_name;
  var blob;

  // setfileの変更で処理開始（変更があった要素がeで返される）
  setfile.addEventListener("change", e => {
    var file = e.target.files;
    console.log(JSON.stringify(file));
    // fileの名前を取得
    file_name = file[0].name;
    // blob形式に変換
    blob = new Blob(file, { type: "image/jpeg", exp: message.value.trim()});
    console.warn(blob);
  });

  // submitで処理開始
  form.addEventListener('submit', e => {
    // ページ遷移をなくす
    e.preventDefault();
    const val = message.value.trim();
    const exp = explain.value.trim();
    const aut = auther.value.trim();
    const cat = category.value.trim();

    var uploadRef = storage.ref('images/').child(file_name);
    console.log(uploadRef);
    if(val === ""){
      window.alert('タイトルを入力してください');
      return;
    }else if (exp ==="") {
      window.alert('説明文を入力してください');
      return;
    }else if (aut ==="") {
      window.alert('作者名を入力してください');
      return;
    }else if (cat ==="") {
      window.alert('カテゴリーを入力してください');
      return;
    }
    message.value ='';
    explain.value ='';
    auther.value ='';
    category.value ='';
    const spinner = document.getElementById('my-spinner');

    // .box に .loaded を追加してローディング表示を消す
    spinner.classList.remove('loaded');
    // storageのarea_imagesへの参照を定義

    uploadRef.put(blob).then(snapshot => {
      console.log(snapshot.state);
    // アップロードしたファイルのurlを取得
      uploadRef.getDownloadURL().then(url => {
        collection.add({
          message: val,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          url:url,
          explain:exp,
          auther:aut,
          category:cat
        }).then(doc=>{
          console.log(`${doc.id} added!`);
        }).catch(error => {
          console.log('document add error!');
          console(error);
        });
        // htmlに表示する
        console.log(`${url}`);
        // imgSample.style.backgroundImage = "url("+url+")";
      }).catch(error => {
        console.log(error);
      });
    });
    // valueリセットする
    file_name = '';
    blob = '';
  });

  collection.orderBy('created').onSnapshot(snapshot =>{
    snapshot.docChanges().forEach(change=>{
      if(change.type==='added'){
        const div = document.createElement('div');
        const d = change.doc.data();
        const image = new Image();
        image.src= d.url;
        const box = pictures.appendChild(div);
        box.appendChild(image);
        const mdata = d.message;
        const desc = d.explain;
        const aut = d.auther;
        const cat = d.category;
        const p = document.createElement('p');
        const p2 = document.createElement('p');
        const p3 = document.createElement('p');
        const p4 = document.createElement('p');
        p3.textContent = `作者: ${aut}`;
        box.appendChild(p3);
        p.textContent = `タイトル名: ${mdata}`;
        box.appendChild(p);
        p4.textContent = `カテゴリー: ${cat}`;//
        box.appendChild(p4);
        p2.textContent = `説明文: ${desc}`;
        box.appendChild(p2);
      }
      const spinner = document.getElementById('my-spinner');
      // // .box に .loaded を追加してローディング表示を消す
      spinner.classList.add('loaded');

    });
  },error=>{

  });


})();
