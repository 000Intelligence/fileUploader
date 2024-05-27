const upload = document.getElementById("upload");
const uploadZone = document.getElementById("upload-zone");
const drag = document.querySelector(".drag");
const drop = document.querySelector(".drop");

// drag and drop api's
uploadZone.addEventListener("dragover", (e) => {
	drop.classList.remove("hidden");
	drop.classList.add("block");
	drag.classList.add("hidden");
	drag.classList.remove("block");
	e.preventDefault();
});

uploadZone.addEventListener("drop", (e) => {
	document.getElementById("upload").files = e.dataTransfer.files;
	drop.classList.remove("block");
	drop.classList.add("hidden");
	drag.classList.remove("hidden");
	drag.classList.add("block");
	uploadFileHandler();
	e.preventDefault();
});

// start upload progress
function uploadFileHandler() {
	const files = upload.files;

	for (let i = 0; i < files.length; i++) {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "");

		const formData = (files[i].name, files[i]);
		const progressBlock = addProgressBar(files[i]);

		xhr.upload.addEventListener("progress", (event) => {
			const progressBar = progressBlock.querySelector(".progress-bar div");
			const progressText = progressBlock.querySelector(".progress-bar p");
			const fileHeader = progressBlock.querySelector(".file-header");

			if (event.lengthComputable == true) {
				const percent = ((event.loaded / event.total) * 100).toFixed(1);
				progressBar.style.width = percent + "%";
				progressBar.classList.add("progressing");
				progressText.textContent = percent + "%";
				progressText.classList.add("fade");

				const progressBarWidth = parseInt(progressBar.style.width);

				if (progressBarWidth > 50) {
					progressText.classList.add("text-slate-50");
				}

				if (progressBarWidth == 100) {
					fileHeader.classList.add("show");
					progressText.textContent = "تکمیل شد";
					progressText.classList.remove("fade");
					setTimeout(() => {
						progressText.innerHTML = `<i class="flex justify-center items-center text-[2rem] animate-pulse"><ion-icon name="cloud-done"></ion-icon></i>`;
					}, 1000);
					progressBar.classList.remove("progressing");
					progressBar.classList.add("bg-[#16a34a]");
				}
			}
		});
		//
		xhr.send(formData);
		//
	}
}

// create upload progress
function addProgressBar(file) {
	const progressArea = document.querySelector(".progress-area");
	const fileName = file.name.slice(0, 15);
	const html = `
    <header class="flex justify-between items-center file-header mb-[0.5rem] hide">
	<div class="flex gap-3">
		<button title="copy link" class="copy-link-btn flex justify-center items-center relative cursor-pointer border border-white border-opacity-70 rounded-lg p-2 duration-200 ease-in-out text-slate-50 text-[1.3rem] hover:bg-violet-600 hover:text-white" onclick="copyFileLink(this)">
			<ion-icon name="documents-outline"></ion-icon>
		</button>
		<button title="delete" class="delete-link-btn flex justify-center items-center relative cursor-pointer border border-white border-opacity-70 rounded-lg p-2 duration-200 ease-in-out text-slate-50 text-[1.3rem] hover:bg-red-600 hover:text-white" onclick="deleteFileLink(this)">
			<ion-icon name="trash-outline"></ion-icon>
		</button>
	</div>
        <h2 class="select-none text-right text-slate-300">${fileName}... : <span class="text-slate-50">نام فایل</span></h2>
    </header>
    <div class="progress-bar w-full h-[34px] overflow-hidden relative rounded-2xl border border-white bg-white">
        <div class="progress-inner bg-transparent h-[34px] duration-200 ease-linear"></div>
        <div class="progress-info flex justify-center items-center gap-[0.5rem] select-none absolute top-[50%] left-[50%]">
            <p class="percent">0</p>
        </div>
    </div>`;

	const block = document.createElement("div");
	block.classList.add("progress-block", "mb-[2rem]", "scaleIn");
	block.innerHTML = html;

	const lastUploaded = progressArea.lastElementChild;
	if (lastUploaded) {
		lastUploaded.classList.add("order-1");
	}

	progressArea.appendChild(block);

	const Container = document.querySelectorAll(".progress-block");
	let containerIndex = 0;

	Container.forEach((cr) => {
		cr.style.viewTransitionName = `cr-${++containerIndex}`;
	});

	return block;
}

upload.addEventListener("change", uploadFileHandler);

// alerts & actions
const alertZone = document.querySelector(".alert-zone");

function copyFileLink() {
	const html = document.createElement("div");
	html.classList.add("scaleIn");
	html.innerHTML = `<div class="p-3 text-xl bg-green-600 border-2 border-white text-white rounded-lg w-max">
		<p>لینک فایل کپی شد</p>
	</div>`;
	alertZone.appendChild(html);

	setTimeout(() => {
		html.remove();
	}, 3000);
}

function deleteFileLink(e) {
	const html = document.createElement("div");
	html.classList.add("scaleIn");
	html.innerHTML = `<div class="p-3 text-xl bg-red-600 border-2 border-white text-white rounded-lg w-max">
		<p>لینک فایل حذف شد</p>
	</div>`;
	alertZone.appendChild(html);

	if (!document.startViewTransition) {
		e.parentNode.parentNode.parentNode.remove();
	}

	document.startViewTransition(() => {
		e.parentNode.parentNode.parentNode.remove();
	});

	setTimeout(() => {
		html.remove();
	}, 3000);
}
