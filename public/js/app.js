'use strict';

const imgObjArrayPage1 = [];
const imgObjArrayPage2 = [];
let OptionKeyWord = [];
let currentPage = imgObjArrayPage1;

 // ano means addNewOption
 const addNewOption = anoKeyword => {
  if(OptionKeyWord.length === 0 || !OptionKeyWord.includes(anoKeyword)){
    OptionKeyWord.push(anoKeyword);
    const newOption = `<option value="${anoKeyword}">${anoKeyword}</option>`;
    $('#title-selector').append(newOption);
  }
};

const imageTitleSort = titleSortArray => {
  titleSortArray.sort((imgTitleObj1,imgTitleObj2) => {
    if(imgTitleObj1.title.toLowerCase() < imgTitleObj2.title.toLowerCase()){
      return -1;
    }else if(imgTitleObj1.title.toLowerCase() > imgTitleObj2.title.toLowerCase()){
      return 1;
    }else{
      return 0;
    }
  })
};

const imageHornSort = hornSortArray => {
  hornSortArray.sort((imgHornObj1, imgHornObj2) => {
    return imgHornObj1.horns - imgHornObj2.horns;
  });
};


function JImageObject (jImgObject){
  this.image_url = jImgObject.image_url;
  this.title = jImgObject.title;
  this.description = jImgObject.description;
  this.keyword = jImgObject.keyword;
  this.horns = jImgObject.horns;
}

// or represents object render
JImageObject.prototype.render = function(orKeyword = '') {
 
  if(this.keyword === orKeyword || !orKeyword || orKeyword === "default"){
    // const $imgCopy = $('#photo-template').clone();
    // $imgCopy.find('h2').text(this.title);
    // $imgCopy.find('h4').text(`horns: ${this.horns}`);
    // $imgCopy.find('img').attr('src', this.image_url);
    // $imgCopy.find('img').attr('alt', this.keyword);
    // $imgCopy.find('p').text(`${this.description}`);
  
    // $imgCopy.removeAttr('id');
  
    // $('ul').append($imgCopy);
    const mustacheImageCopy = $('#photo-template').html();
    const mustacheImageCopyRender = Mustache.render(mustacheImageCopy, this);
    $('ul').append(mustacheImageCopyRender);
    
  }
  addNewOption(this.keyword);
}

const refreshPageImages = (rpiInputObject = '') => {
  $('ul').empty();

  currentPage.forEach(imgDataObjRender => {
    imgDataObjRender.render(rpiInputObject);
  });
}

const refreshSelectElement = () => {
  const optionDefaultSelection = "<option value=\"default\">All Images</option>"

  $('#title-selector').empty();
  OptionKeyWord = [];
  $('#title-selector').append(optionDefaultSelection);
}

$('#title-selector').on('change', e => {
  refreshPageImages(e.target.value);
});

$('#page-1-button').on('click', e => {
  currentPage = imgObjArrayPage1;
  refreshSelectElement();
  refreshPageImages();
})

$('#page-2-button').on('click', e => {
  currentPage = imgObjArrayPage2;
  refreshSelectElement();
  refreshPageImages();
})

$('#sort-selector').on('change', e => {
  if(e.target.value === "alphabetical"){
    imageTitleSort(imgObjArrayPage1);
    imageTitleSort(imgObjArrayPage2);
    refreshPageImages();
  }else{
    imageHornSort(imgObjArrayPage1);
    imageHornSort(imgObjArrayPage2);
    refreshPageImages()
  }
});

$.ajax({
  url: './data/page-1.json',
  async: true,
  success: dataObj => {
    dataObj.forEach(imgDataObj => imgObjArrayPage1.push(new JImageObject(imgDataObj)));
  }
}).then(() => {
  imageTitleSort(imgObjArrayPage1);
  currentPage.forEach(imgDataObjRender => {
    imgDataObjRender.render();
  });  
});

$.ajax({
  url: './data/page-2.json',
  async: true,
  success: dataObj => {
    dataObj.forEach(imgDataObj => imgObjArrayPage2.push(new JImageObject(imgDataObj)));
  }
}).then(() => {
  imageTitleSort(imgObjArrayPage2);
});