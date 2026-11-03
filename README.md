devdebt1 — Portfolio
A simple portfolio site for Assetto Corsa to Roblox Studio car imports.
Pages
•	index.html — Home
•	brands.html — Car brands
•	brand-bmw.html, brand-toyota.html, brand-nissan.html — Brand pages
•	buy.html — Buy / request imports
•	contact.html — Contact form
Publish on GitHub Pages
1.	Create a repository named devdebt1.github.io.
2.	Upload every file and folder from this project to the repository.
3.	Go to Settings → Pages.
4.	Set Source to Deploy from a branch, Branch to main, and Folder to /(root).
5.	Save, then open https://devdebt1.github.io.
Add your car images
Put your images in the images folder.
Then open a brand page, find a car block like this:
<img src="images/placeholder-car.jpg" alt="Car name">
<div class="car-info">
  <h3>Car name</h3>
  <p>Short note about the import.</p>
</div>

Change placeholder-car.jpg to your image file name, then update the car name and text.
Add a new brand
1.	Copy brand-bmw.html.
2.	Rename it, for example: brand-honda.html.
3.	Open it and change the title and heading to the brand name.
4.	Add a card for it in brands.html.
