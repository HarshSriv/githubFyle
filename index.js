
const mainBody = document.querySelector('#mainBody');
const mainContainer = document.querySelector("#dynamicContent");



const fetchUserData = async () => {
    const element = document.getElementById("dynamicContent");
    while (element.firstChild) {
    element.removeChild(element.firstChild);
    }
mainBody.style.display='block';
let inputElement = document.querySelector("#GithubUserName");
let userId = inputElement.value.trim();
    let pageFooter = document.querySelector("#footer");
    pageFooter.innerHTML = "";
    loader.style.display = "flex";
    mainContainer.innerHTML = "";

  
    if (userId) {
      console.log(userId);
      
      const apiUrl = `https://api.github.com/users/${userId}`;
      const apiUrlRepos = `https://api.github.com/users/${userId}/repos`;
  
   
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
  
    let currentPage = 1;
    let reposPerPage = 10;
    let public_repos = 0;
  
    let loader = document.querySelector("#loader");
    const apiUrlWithParams = `${apiUrlRepos}?page=${currentPage}&per_page=${reposPerPage}`;
  
    const slider = document.getElementById("slider");
  
    const sliderValue = document.getElementById("sliderValue");
  

    let fetchedRepoData=[];
  
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.public_repos > 100) {
            slider.max = 100;
        } else {
            slider.max = data.public_repos;
        }
        document.getElementById("profilePic").src = data.avatar_url;
        document.getElementById("userName").textContent = data.name || "N/A";
        document.getElementById("userBio").textContent = data.bio || "N/A";
        document.getElementById("userLocation").textContent =
          data.location || "N/A";
        document.getElementById("htmlUrl").textContent = `${
          data.html_url || "N/A"
        }`;
        document.getElementById("htmlUrl").href = `${
          data.html_url || "N/A"
        }`;
        document.getElementById(
          "userTwitterLink"
        ).textContent = `Twitter: https://twitter.com/${
          data.twitter_username || ""
        }`;
        document.getElementById(
          "userTwitterLink"
        ).href = `https://twitter.com/${
          data.twitter_username || ""
        }`;
        public_repos = data.public_repos;
        console.log(public_repos);
        createPaginationButtons(
          currentPage,
          Math.ceil(public_repos / reposPerPage)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  
    slider.addEventListener("input", function () {
      sliderValue.textContent = this.value;
      reposPerPage = this.value;
      let mainContainer = document.getElementById("dynamicContent");
     
      mainContainer.innerHTML = "";
      let pageFooter = document.querySelector(".pagination-container");
      pageFooter.innerHTML = "";
     
      createPaginationButtons(
        currentPage,
        Math.ceil(public_repos / reposPerPage)
      );
    });
  
    const fetchRepos = (currentPage) => {
      let mainContainer = document.getElementById("dynamicContent");
      loader.style.display = "flex";
      mainContainer.innerHTML = "";
  
      fetch(
        `${apiUrlRepos}?page=${currentPage}&per_page=${reposPerPage}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
  
          fetchedRepoData=data;
  
          console.log(fetchedRepoData);
  
  ////////////////////////////////////////////////////////////////////////
        searchButton.addEventListener('click',()=>{
         
          const inputValue = searchInput.value;

function filterRepoData(data, filterCriteria) {
    const lowerFilterCriteria = filterCriteria.toLowerCase();
    return data.filter((repo) => {
      const lowerRepoName = repo.name.toLowerCase();
      return lowerRepoName.includes(lowerFilterCriteria);
    });
  }
  
  const filteredRepos = filterRepoData(fetchedRepoData, inputValue);
  showFilteredData(filteredRepos,reposPerPage);
  console.log(filteredRepos);
  
  
         
          })
  ////// ////////////////////////////////////////////////////////////////
  
          loader.style.display = "none";
  
          const container = document.createElement("div");
          container.classList.add("repoContainer");
  
          const leftSide = document.createElement("div");
          leftSide.classList.add("left-side");
  
          const rightSide = document.createElement("div");
          rightSide.classList.add("right-side");
          
          if (mainContainer) {
            while (mainContainer.firstChild) {
                mainContainer.removeChild(mainContainer.firstChild);
            }
          }
        //   mainBody.innerHTML='';


          data.forEach((item, index) => {
            const div = document.createElement("div");
            div.id = `item-${index}`;
            div.style.border = "2px solid black";
            div.style.backgroundColor = "white";
            div.style.margin = "10px";
  
            //heading
            const heading = document.createElement("h2");
            heading.textContent = item.name;
            heading.style.color = "rgb(40, 117, 223)";
            heading.style.padding = "10px";
            div.appendChild(heading);
  
            //para
            const paragraph = document.createElement("p");
            paragraph.textContent = item.description;
            paragraph.style.marginLeft = "10px";
            
            div.appendChild(paragraph);
  
            //lang
            fetch(item.languages_url)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then((langData) => {
                Object.keys(langData).forEach((langKey) => {
                  const langParagraph = document.createElement("p");
                  langParagraph.style.display = "inline-block";
                  langParagraph.style.margin = "10px";
                  langParagraph.style.marginBottom = "10px";
                  langParagraph.style.padding = "10px";
                  langParagraph.style.backgroundColor = "rgb(40, 117, 223)";
                  langParagraph.style.color = "white";
                  langParagraph.textContent = `${langKey}`;
                  div.appendChild(langParagraph);
                });
              })
              .catch((error) => {
                console.error("Error fetching language data:", error);
              });
  
            container.appendChild(div);
  
            if (index < Math.ceil(reposPerPage / 2)) {
              leftSide.appendChild(div);
            } else {
              rightSide.appendChild(div);
            }
          });
  
          container.appendChild(leftSide);
          container.appendChild(rightSide);
  
          document.body.appendChild(container);
  
          mainContainer.appendChild(container);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
  
        


    function createPaginationButtons(currentPage, totalPages) {
      //loads repos first time
      fetchRepos(currentPage);
  
      const container = document.getElementById("footer");
  
      container.classList.add("pagination-container");
  
      const prevButton = document.createElement("button");
      prevButton.textContent = "<<";
      prevButton.style.backgroundColor = "white";
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          updatePage(currentPage - 1);
        }
      });
      container.appendChild(prevButton);
  
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.id = `btn-${i}`;
        pageButton.style.backgroundColor = "white";
        pageButton.style.border = "1px solid black";
        pageButton.style.width = "2%";
        pageButton.textContent = i;
        pageButton.addEventListener("click", () => updatePage(i));
        container.appendChild(pageButton);
      }
  
      const nextButton = document.createElement("button");
      nextButton.textContent = ">>";
      nextButton.style.backgroundColor = "white";
      nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
          updatePage(currentPage + 1);
        }
      });
      container.appendChild(nextButton);
  
      // Append the container to the document body
      document.body.appendChild(container);
  
      // Function to update the page
      function updatePage(newPage) {
        let btn = document.querySelector(`#btn-${newPage}`);
        for (let i = 1; i <= totalPages; i++) {
          let btn1 = document.querySelector(`#btn-${i}`);
          btn1.style.backgroundColor = "white";
          btn1.style.color = "rgb(40, 117, 223)";
        }
        btn.style.backgroundColor = "rgb(40, 117, 223)";
        btn.style.color = "white";
        currentPage = newPage;
        fetchRepos(currentPage);
        console.log(`Page changed to ${newPage}`);
      }
    }
  
  } else {
   
    alert("Invalid input. Please enter a GitHub username.")
  }
   };


  const showFilteredData=(dataFiltered,reposPerPage)=>{
    let mainContainer = document.getElementById("dynamicContent");
    mainContainer.innerHTML = "";
     const container = document.createElement("div");
          container.classList.add("repoContainer");
  
          const leftSide = document.createElement("div");
          leftSide.classList.add("left-side");
  
          const rightSide = document.createElement("div");
          rightSide.classList.add("right-side");
  
          dataFiltered.forEach((item, index) => {
            const div = document.createElement("div");
            div.id = `item-${index}`;
            div.style.border = "2px solid black";
            div.style.backgroundColor = "white";
            div.style.margin = "10px";
  
            //heading
            const heading = document.createElement("h2");
            heading.textContent = item.name;
            heading.style.color = "rgb(40, 117, 223)";
            heading.style.padding = "10px";
            div.appendChild(heading);
  
            //para
            const paragraph = document.createElement("p");
            paragraph.textContent = item.description;
            paragraph.style.marginLeft = "10px";
            
            div.appendChild(paragraph);
  
            //lang
            fetch(item.languages_url)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then((langData) => {
                Object.keys(langData).forEach((langKey) => {
                  const langParagraph = document.createElement("p");
                  langParagraph.style.display = "inline-block";
                  langParagraph.style.margin = "10px";
                  langParagraph.style.marginBottom = "10px";
                  langParagraph.style.padding = "10px";
                  langParagraph.style.backgroundColor = "rgb(40, 117, 223)";
                  langParagraph.style.color = "white";
                  langParagraph.textContent = `${langKey}`;
                  div.appendChild(langParagraph);
                });
              })
              .catch((error) => {
                console.error("Error fetching language data:", error);
              });
  
            container.appendChild(div);
  
            if (index < Math.ceil(reposPerPage / 2)) {
              leftSide.appendChild(div);
            } else {
              rightSide.appendChild(div);
            }
          });
  
          container.appendChild(leftSide);
          container.appendChild(rightSide);
  
          document.body.appendChild(container);
  
          mainContainer.appendChild(container);
  }












  