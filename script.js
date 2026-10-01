document.querySelectorAll('.resume-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    alert('CV download will be added here once the final CV is selected.');
  });
});
const menu=document.querySelector('.menu'); const links=document.querySelector('.nav-links');
if(menu&&links) menu.addEventListener('click',()=>links.classList.toggle('open'));
