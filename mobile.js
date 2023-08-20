window.addEventListener("load", () => {
    if(window.location.hash) {
      const currentVideoId = window.location.hash.substring(1);
      console.log(currentVideoId);
    } else {
      console.log('no hash');
    }
    });
  
  const firebaseConfig = {
      apiKey: "your-api-key",
      authDomain: "#################",
      databaseURL: "#######################",
      projectId: "########################",
      storageBucket: "#######################",
      messagingSenderId: "#########################",
      appId: "##############################",
      measurementId: "####################################"
    };
        
      
    firebase.initializeApp(firebaseConfig);
  
    
  
    
    firebase.auth().onAuthStateChanged([YOUR_ITEM]=>{
      if ([YOUR_ITEM]) {
          // store the [YOUR_ITEM] on local storage
          localStorage.setItem('[YOUR_ITEM]', true);
          const comment[YOUR_ITEM]IdInput= document.getElementById('input-[YOUR_ITEM]id');
          comment[YOUR_ITEM]IdInput.value = [YOUR_ITEM].uid;
      } else {
          // removes the [YOUR_ITEM] from local storage on logOut
          localStorage.removeItem('[YOUR_ITEM]');
      }
  })
  
  const [YOUR_ITEM]Local = JSON.parse(localStorage.getItem('[YOUR_ITEM]'));
    
    const currentPageURL = window.location.pathname;
    const targetPagePathPrefix = '/upload'; 
    
    if (!currentPageURL.includes(targetPagePathPrefix)) {
      
    
    firebase.firestore()
    .collection("egress-window-videos")
    .where("videoUrl", "!=", " ")
    .get()
    .then((querySnapshot) => {
      // Filter the query results based on the "date" field
      const filteredResults = querySnapshot.docs
        .filter((doc) => doc.data().date > 0)
        .sort((a, b) => b.data().date - a.data().date)
        .slice(0, 20);
      
      const vidItems = [];
      filteredResults.forEach((doc) => {
        const vidItem = doc.data();
    
        vidItems.push({
          videoUrl: vidItem.videoUrl,
          avatar: vidItem.avatar,
          displayName: vidItem.displayName,
          time: vidItem.date,
          likeCount: vidItem.likeCount,
          content: vidItem.content,
          //link
          comments: vidItem.comments,
          id: doc.id
        });
    
        const thumbnailUrl = vidItem.videoUrl.replace(/\.\w+$/, ".png");
        const ogImageUrl = thumbnailUrl.replace('/upload/', '/upload/w_1920,h_1080,c_lpad,b_auto/');
        const videoStructuredData = document.getElementById('videoStructuredData');
        
        const iso8601Date = new Date(vidItem.date).toISOString();
    
          // Create an object to represent the JSON-LD data for this video
          const videoData = {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": vidItem.displayName, // Use the title for this video
            "description": vidItem.content, // Use the description for this video
            "thumbnailUrl": thumbnailUrl, // Use the dynamically generated thumbnail URL for this video
            "uploadDate": iso8601Date, // Use the upload date for this video (in ISO 8601 format)
            "contentUrl": vidItem.videoUrl, // Use the URL to the video file for this video
            "duration": vidItem.duration // Use the duration for this video (in ISO 8601 duration format)
          };
    
          
          // Set the JSON-LD data as text content of the script element
          videoStructuredData.textContent = JSON.stringify(videoData);
       
          const ogTitleMetaTag = document.querySelector('meta[property="og:title"]');
          const ogDescriptionMetaTag = document.querySelector('meta[property="og:description"]');
          const ogImageMetaTag = document.querySelector('meta[property="og:image"]');
          const descriptionTag = document.querySelector('meta[name="description"]');
          const titleTag = document.querySelector('title');
    
    
          ogTitleMetaTag.setAttribute('content', vidItem.displayName); // Set the video title as OG title
          ogDescriptionMetaTag.setAttribute('content', vidItem.content); // Set the video description as OG description
          ogImageMetaTag.setAttribute('content', ogImageUrl); // Set the dynamically generated thumbnail URL as OG image
          descriptionTag.setAttribute('content', vidItem.content);
          titleTag.textContent = (vidItem.displayName);
    
    
      });
  
       // Check if there is a hash and if the docId exists in the vidItems array
       const hash = window.location.hash;
       if (hash && hash.length > 1) {
         const docIdFromHash = hash.substring(1);
         const index = vidItems.findIndex((item) => item.id === docIdFromHash);
         if (index !== -1) {
           // If docId exists, move that item to the first position
           const selectedItem = vidItems.splice(index, 1)[0];
           vidItems.unshift(selectedItem);
         }
       }
    
      
          initializeVideoSlides(vidItems);
        })
        .catch((error) => {
          console.log('Error getting videos:', error);
        });
    
        
      
      function initializeVideoSlides(vidItems) {
        const slideContainer = $('.swiper-wrapper');
      
        vidItems.forEach((item) => {
          const { videoUrl, avatar, displayName, content, link, time, id } = item;
          const posterUrl = videoUrl.replace(/\.\w+$/, ".jpg");
          const slide = $('<div class="swiper-slide"><script id="videoStructuredData" type="application/ld+json"></script></div>');
    
          slide.attr('data-hash', `${id}`); 
          
    
          const divoo = $('<div class="swiper-div"></div>');
          divoo.css({
            position: 'absolute',
            right: '0px',
            top: '0px',
            width: '120px',
            height: '90vh',
            border: 'none',
            outline: 'none',
            borderRadius: '15px',
            zIndex: 9999999999,
            cursor: 'grabbing',
            backgrounColor: 'rgba(0,0,0,0)',        
          });
          
          const iframe = $(`<video id="${id}" class="video-iframe" title="Video Player" autoplay loop muted playsinline poster="${posterUrl}" src=""></video>`);
          
          iframe.attr('src', videoUrl);
          
          const avatarElement = $(
            `<div class="post">
                       <div class="[YOUR_ITEM]-section"><img class="avatar" alt="[YOUR_ITEM] avatar "src=${avatar}><div class="[YOUR_ITEM]-name"><p>${displayName}</p></div></div>
                      <div class="content" id="scroll-container"><p id="scroll-text">${content}</p></div>
            </div>`);
    
          iframe.css({
            width: '100vw',
            height: '90vh',
            border: 'none',
            outline: 'none',
            borderRadius: '15px',
            maxHeight: '800px',
            maxWidth: '800px',
          });
          slideContainer.append(slide);
          slide.append(iframe);
          slide.append(divoo);
          slide.append(avatarElement);
          
          
          
        });
      
        initializeSwiper();
      }
      
      function initializeSwiper() {
        var swiper = new Swiper('.swiper-container', {
          direction: 'vertical',        
          navigation: {},
          initialSlide: 1,
          autoPlay: true,
          slidesPerView: 1,
          spaceBetween: 0,
          mousewheel: true,
          keyboard: true,
          lazy: true,    
          updateOnWindowResize:true,
          speed:250,
          allowTouchMove: true,      
          touchEventsTarget: '.swiper-container',
          hashNavigation:{replaceState:true, watchState: true},
          loop: true,        
          paginationClickable: true,     
          navigation: {
          nextEl: ".cust-swiper-button-next",
          prevEl: ".cust-swiper-button-prev",
        },
        on: {
          transitionStart: function(){
            
            var videos = document.querySelectorAll('video');
      
            Array.prototype.forEach.call(videos, function(video){
              video.pause();
            });
          },
          
          transitionEnd: function(){
            
            var activeIndex = this.activeIndex;
            var activeSlide = document.getElementsByClassName('swiper-slide')[activeIndex];
            var activeSlideVideo = activeSlide.getElementsByTagName('video')[0];
            activeSlideVideo.play();
          
          },
        
          
        }
          
        });
        
        /*
        if (window.location.href.includes('#')){
        swiper.slidePrev();
        }
     
        swiper.on('afterInit', function(swiper) {
          swiper.slidePrev();
        });
    */
        swiper.on('touchStart', function () {
          var barIndex = swiper.activeIndex;
          var barSlide = $(swiper.slides[barIndex]);  
          var barIframe = barSlide.find('.video-iframe')[0];  
          try {
            console.log('pause', '*');} catch (error) {
             console.error(error);
             
            } 
         
    
        });
      
        
      
        swiper.on('slideChangeTransitionEnd', function () {
          var index = swiper.activeIndex;
          var currentSlide = $(swiper.slides[index]);
          var currentSlideType = currentSlide.data('slide-type');
          var videoIframe = currentSlide.find('.video-iframe')[0];
          try {
           console.log('play', '*');} catch (error) {
             console.error(error);
              
            }
      
         if (currentSlideType === 'vdo') {
            
            
          } else {
            
          }
          
            // Get the current video ID from the vidItems array
            currentVideoId = window.location.hash.substring(1);
    
            // Fetch and display comments for the current video
            fetchCommentsAndDisplay(currentVideoId);
        });
      }
    
    
      /*
      function next() {
       var swiper = $('.swiper-container').data('swiper');
        //var currentSlide = swiper.activeIndex;
        //var prevIframe = currentSlide.find('.video-iframe')[0];
      
        //if (iframe.length > 0) {
         // try {
            //prevIframe.contentWindow.postMessage('pause', '*');} catch (error) {
              //console.error(error);
              //prevIframe.click();
            //}
          
        //}
      
        swiper.slideNext();
      }
    */
    
      // Get a reference to the share button
    const shareButton = document.getElementById('share');
    
    if (shareButton) {
    // Add click event listener to the share button
    shareButton.addEventListener('click', () => {
      // Check if the Web Share API is supported by the browser
      if (navigator.share) {
        // Assuming you have a function getShareData() that retrieves the data to be shared.
        // Replace the getShareData() function with your logic to get the shareable data.
        const shareData = getShareData();
        
        // Call the Web Share API's navigator.share() method with the share data
        navigator.share(shareData)
         .then(() => console.log('Shared successfully!'))
         .catch((error) => console.error('Error sharing:', error));
      } else {
        // Fallback for browsers that do not support the Web Share API
        console.log('Web Share API is not supported.');
        shareFallback();
        // Here, you can display a custom share sheet or implement other sharing options.
      }
    });
    
    // Function to get the shareable data
    function getShareData() {
      // Get the current URL from the browser's address bar
      const currentURL = window.location.href;
    
      // Replace with the actual data you want to share
      return {
        
        url: currentURL // Use the current URL as the share URL
      };
    }
    
    } 
    // Function to handle the "like" button click
    function handleLikeButtonClick() {
      // Create a new heart image element
      const heartImg = document.createElement('img');
      heartImg.src = 'heart.jpeg';
      heartImg.id = 'heart-img';
    
      // Add the heart image to the document body
      document.body.appendChild(heartImg);
    
      // Center the heart image on the screen
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const heartImgWidth = 80; // Adjust this value to control the size of the heart image
      const heartImgHeight = 80; // Adjust this value to control the size of the heart image
      const centerX = screenWidth / 2 - heartImgWidth / 2;
      const centerY = screenHeight / 2 - heartImgHeight / 2;
      heartImg.style.width = '100px';
      heartImg.style.height = '100px';
      heartImg.style.position = 'fixed';
      heartImg.style.zIndex = 99999;
      heartImg.style.left = `${centerX}px`;
      heartImg.style.top = `${centerY}px`;
    
      // Scale the heart image larger
      heartImg.style.transform = 'scale(1.5)';
      heartImg.style.transition = 'transform 1.5s';
    
      // Make the heart image visible
      heartImg.style.display = 'block';
    
      // After a short duration, make the heart image disappear
      setTimeout(() => {
        // Step 2: Scale down with a transition
        heartImg.style.transform = 'scale(1)';
        heartImg.style.transition = 'transform 0.5s';
        setTimeout(() => {
          // Step 3: Move up and disappear with an animation
          heartImg.style.animation = 'flyUpAndDisappear 2s';
          // After the animation duration, hide the heart image and remove it from the DOM
          setTimeout(() => {
            heartImg.style.display = 'none';
            document.body.removeChild(heartImg);
          }, 500); // Adjust the duration (in milliseconds) to control how long the heart image appears
        }, 500); // Delay before starting the next step (in milliseconds)
      }, 500); // Delay before starting the next step (in milliseconds)
    }
    
    // Add a click event listener to the "like" button
    const likeButton = document.getElementById('like');
    
    if (likeButton) {
      likeButton.addEventListener('click', handleLikeButtonClick);
    }
    
    
    
    
    
    /*
    
    // Now you can use the shareFallback function wherever needed
    shareFallback()
      .then(() => {
        // Share fallback completed
        console.log('Share fallback completed successfully.');
      })
      .catch((error) => {
        // Handle any errors during the share fallback
        console.error('Error during share fallback:', error);
      });
    
    
      function shareFallback() {
        return new Promise(async (resolve) => {
          const webSocialShare = document.querySelector('web-social-share');
      
          if (!webSocialShare || !window) {
            return;
          }
      
          const currentURL = window.location.href;
      
          const share = {
            displayNames: true,
            config: [
              {
                facebook: {
                  socialShareUrl: currentURL,
                },
              },
              {
                twitter: {
                  socialShareUrl: currentURL,
                },
              },          
              {
                whatsapp: {
                  socialShareUrl: currentURL,
                },
              }
            ],
          };
      
          // The configuration, set the share options
          webSocialShare.share = share;
          // Show/open the share actions
          webSocialShare.show = true;
      
          resolve();
        });
      }
    */
      function fetchComments(videoId) {
      const commentsRef = firebase.firestore().collection("egress-window-videos").doc(videoId);
    
      return commentsRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            const comments = docSnapshot.data().comments;
            return comments ? comments : [];
          } else {
            return [];
          }
        })
        .catch((error) => {
          console.error('Error fetching comments:', error);
          return [];
        });
    }
    
      function displayComments(comments) {
        const commentsContainer = $('.comments-bar');
        commentsContainer.empty();
      
        comments.forEach((comment) => {
          const commentElement = $('<div class="comment"></div>');
          const avatarImg = $('<img class="avatar" alt="[YOUR_ITEM] avatar">');
          const commentTextBubble =  $('<div class="comment-bubble"></div>');
          avatarImg.attr('src', comment.avatar);
          const commentText = $('<p class="comment-text"></p>');
          commentText.text(comment.comment);
          const commentDate = $('<p class="comment-date"></p>');
          commentDate.text(new Date(comment.date).toLocaleString());
          
          commentTextBubble.append(commentText);
          commentElement.append(avatarImg, commentTextBubble, commentDate);
          
          commentsContainer.append(commentElement);
        });
      }
      
      // Function to fetch and display comments for the current video
      function fetchCommentsAndDisplay(videoId) {
        fetchComments(videoId)
          .then((comments) => {
            displayComments(comments);
          });
      }
    
    
    
    
    // Function to check [YOUR_ITEM] login status on page load
    function check[YOUR_ITEM]LoginStatus() {
      firebase.auth().onAuthStateChanged(([YOUR_ITEM]) => {
        if ([YOUR_ITEM]) {
          // [YOUR_ITEM] is logged in
          const [YOUR_ITEM]Id = [YOUR_ITEM].uid; // Get the [YOUR_ITEM]Id
          console.log("[YOUR_ITEM] is logged in with [YOUR_ITEM]Id:", [YOUR_ITEM]Id);
          showSnackBar();
          const publishButton = document.getElementById("publish");
          const loginButton = document.getElementById("logup");
          loginButton.classList.toggle('hide');      
          publishButton.classList.remove('hide');
      
          // Fetch [YOUR_ITEM] info from the "[YOUR_ITEM]s" collection
          fetch[YOUR_ITEM]Info([YOUR_ITEM]Id)
            .then(([YOUR_ITEM]Info) => {
              // Set the fields for the [YOUR_ITEM]'s comments
              setCommentFields([YOUR_ITEM]Info);
              // Hide login screen and show the "leave comment" section
              document.getElementById("login-form").style.display = "none";
              document.getElementById("leave-comment").style.display = "flex";
              document.getElementById("leave-comment").style.flexDirection = "column";
            })
            .catch((error) => {
              console.error("Error fetching [YOUR_ITEM] info:", error);
            });
        } else {
          // [YOUR_ITEM] is not logged in
          console.log("[YOUR_ITEM] is not logged in.");
          // Show login screen and hide the "leave comment" section
          document.getElementById("login-form").style.display = "flex";
          document.getElementById("leave-comment").style.display = "none";
          const publishButton = document.getElementById("publish");
          const loginButton = document.getElementById("logup");
          loginButton.classList.toggle('show');
          loginButton.classList.remove('hide');
          publishButton.classList.remove('show');
          publishButton.classList.toggle('hide');
        }
      });
    }
    
    // Call the check[YOUR_ITEM]LoginStatus function on page load
    //window.addEventListener("DOMContentLoaded", () => {
    //  check[YOUR_ITEM]LoginStatus();
    //});
    
    // Function to handle login with email and password
    function loginWithEmailAndPassword() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
    
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        // Now, perform the sign-in
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(([YOUR_ITEM]Credential) => {
            // [YOUR_ITEM] signed in successfully
            const [YOUR_ITEM] = [YOUR_ITEM]Credential.[YOUR_ITEM];
            const [YOUR_ITEM]Id = [YOUR_ITEM].uid; // Get the [YOUR_ITEM]Id
            console.log("[YOUR_ITEM] signed in with [YOUR_ITEM]Id:", [YOUR_ITEM]Id);
            showSnackBar();
            document.getElementById("login-form").style.display = "none";
            document.getElementById("leave-comment").style.display = "flex";
            document.getElementById("leave-comment").style.flexDirection = "column";
            const publishButton = document.getElementById("publish");
            const loginButton = document.getElementById("logup");
            loginButton.classList.toggle('hide');      
            publishButton.classList.remove('hide');
    
            // Fetch [YOUR_ITEM] info from the "[YOUR_ITEM]s" collection and update fields
            fetch[YOUR_ITEM]Info([YOUR_ITEM]Id)
              .then(([YOUR_ITEM]Info) => {
                // Set the fields for the [YOUR_ITEM]'s comments
                setCommentFields([YOUR_ITEM]Info);
                // Hide login screen and show the "leave comment" section
                document.getElementById("login-form").style.display = "none";
                document.getElementById("leave-comment").style.display = "flex";
                document.getElementById("leave-comment").style.flexDirection = "column";
              })
              .catch((error) => {
                console.error("Error fetching [YOUR_ITEM] info:", error);
              });
          })
          .catch((error) => {
              
            
            console.error("Error signing in:", error);
          });
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
    
    }
    
    function sendNewComment() {
      // Get the values from the form inputs
      const newCommentInput = document.getElementById("new-comment");
      const commentText = newCommentInput.value.trim();
      const [YOUR_ITEM]IdInput = document.getElementById("input-[YOUR_ITEM]id");
      const avatarInput = document.getElementById("input-avatar");
      const displayNameInput = document.getElementById("input-displayname");
      const videoIdInput = document.getElementById("input-videoid");
    
      // Check if the comment is not empty before sending
      if (commentText !== "" && currentVideoId) {
        // Get the values from the form inputs
        const videoId = currentVideoId;
        const [YOUR_ITEM]Id = [YOUR_ITEM]IdInput.value;
        const avatar = avatarInput.value;
        const displayName = displayNameInput.value;
    
        // Call the sendNewComment function with the extracted values
        sendNewCommentToFirebase(videoId, commentText, [YOUR_ITEM]Id, avatar, displayName)
          .then((success) => {
            if (success) {
              // Clear the input field after successful comment submission
              newCommentInput.value = "";
            }
          });
      }
    }
            
    
    
    
    
      // Function to send a new comment to Firebase
      function sendNewCommentToFirebase(videoId, commentText, [YOUR_ITEM]Id, avatar, displayName) {
        // Get a reference to the video document in Firebase
        const videoRef = firebase.firestore().collection("egress-window-videos").doc(videoId);
      
        // Fetch the current comments from the document
        return videoRef
          .get()
          .then((docSnapshot) => {
            if (docSnapshot.exists) {
              // Get the current comments array or create an empty array if it doesn't exist
              const currentComments = docSnapshot.data().comments || [];
      
              // Add the new comment to the array
              currentComments.push({
                avatar: avatar,
                comment: commentText,
                date: new Date().getTime(),
                displayName: displayName, // Replace with the display name of the [YOUR_ITEM]
                [YOUR_ITEM]Id: [YOUR_ITEM]Id, // Replace with the [YOUR_ITEM]'s ID
              });
      
              // Update the comments array in the video document
              return videoRef
                .update({ comments: currentComments })
                .then(() => {
                  console.log("New comment added successfully.");
                  fetchCommentsAndDisplay(videoId);
                  return true;
                })
                .catch((error) => {
                  console.error("Error adding new comment:", error);
                  return false;
                });
            } else {
              console.error("Video document does not exist.");
              console.log(videoId);
              return false;
            }
          })
          .catch((error) => {
            console.error("Error fetching video document:", error);
            console.log(currentComments);
            return false;
    
          });
      }
      
      
    
    
    function fetch[YOUR_ITEM]Info([YOUR_ITEM]Id) {
      const [YOUR_ITEM]sRef = firebase.firestore().collection("[YOUR_ITEM]s");
      return [YOUR_ITEM]sRef.doc([YOUR_ITEM]Id).get()
        .then((doc) => {
          if (doc.exists) {
            return doc.data();
            
          } else {
            throw new Error("[YOUR_ITEM] not found in the '[YOUR_ITEM]s' collection.");
          }
        })
        .catch((error) => {
          throw error;
        });
    }
    
    // Function to set the fields for the [YOUR_ITEM]'s comments
    function setCommentFields([YOUR_ITEM]Info, [YOUR_ITEM]Id) {
      const [YOUR_ITEM]PicDiv = document.getElementById("[YOUR_ITEM]-avatar");
      const displayNameField = document.getElementById("display-name");
      const avatarField = document.createElement('img');
      const inputAvatar = document.getElementById("input-avatar");
      const input[YOUR_ITEM]Id = document.getElementById("input-[YOUR_ITEM]id");
      const inputDisplayName = document.getElementById("input-displayname");
      inputDisplayName.value = [YOUR_ITEM]Info.displayName;
      input[YOUR_ITEM]Id.value = [YOUR_ITEM]Id;
      inputAvatar.value = [YOUR_ITEM]Info.photoURL;
      avatarField.style.width = "40px";
      avatarField.style.height = "40px";
      avatarField.style.borderRadius = "100%";
      avatarField.setAttribute('src', [YOUR_ITEM]Info.photoURL);
    
      // Check if the [YOUR_ITEM] row already exists before appending the avatarField
      if ([YOUR_ITEM]PicDiv.children.length === 0) {
        [YOUR_ITEM]PicDiv.append(avatarField);
      }
    
      // Set the fields using the [YOUR_ITEM] info from the "[YOUR_ITEM]s" collection
      displayNameField.textContent = [YOUR_ITEM]Info.displayName;
    
      // You can set other fields here if needed
    }
    
    /*
    function setCommentFields([YOUR_ITEM]Info, [YOUR_ITEM]Id) {
      const [YOUR_ITEM]PicDiv = document.getElementById("[YOUR_ITEM]-avatar");
      const displayNameField = document.getElementById("display-name");
      const avatarField = document.createElement('img');
      const inputAvatar = document.getElementById("input-avatar");
      const input[YOUR_ITEM]Id = document.getElementById("input-[YOUR_ITEM]id");
      const inputDisplayName = document.getElementById("input-displayname");
      inputDisplayName.value = [YOUR_ITEM]Info.displayName;
      input[YOUR_ITEM]Id.value = [YOUR_ITEM]Id;
      inputAvatar.value = [YOUR_ITEM]Info.photoURL;
      avatarField.style.width = "40px";
      avatarField.style.height = "40px";
      avatarField.style.borderRadius = "100%";
      avatarField.setAttribute('src', [YOUR_ITEM]Info.photoURL);
      [YOUR_ITEM]PicDiv.append(avatarField);
    
      // Set the fields using the [YOUR_ITEM] info from the "[YOUR_ITEM]s" collection
      displayNameField.textContent = [YOUR_ITEM]Info.displayName;
    
      // You can set other fields here if needed
    }
    
    */
    }
    
    function showSnackBar() {
      // Get the snackbar DIV
      var x = document.getElementById("snackbar");
    
      // Add the "show" class to DIV
      x.className = "show";
    
      // After 3 seconds, remove the show class from DIV
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
