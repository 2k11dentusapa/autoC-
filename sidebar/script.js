/* ============= KHỞI TẠO BIẾN TOÀN CỤC, ĐỐI TƯỢNG DOM =============== */

const clubName = '';
const webhook = atob(btoa(atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTUxOTI4OTQzOTk5MjY3NjQzNC9pcTY1bTB4UHFHVkQ1eURIdHpZVWI5bzk2MFM0YzNfWnotSW54Sk1JQ0dfMU9ILVZxT0RYdnNKQmY1MDdMS0N0Q2ZnRw==')));

const progressBar = document.getElementById('progressBar'),
      progressCurrentCount = document.getElementById('progressCurrentCount'),
      progressNextGoal = document.getElementById('progressNextGoal'),
      memberCount = document.getElementById('memberCount'),
      leaderBoard = document.getElementById('leaderBoard'),
      sendFeedbackInput = document.getElementById('sendFeedbackInput'),
      sendFeedbackButton = document.getElementById('sendFeedbackButton');

/* ============= XỬ LÝ CHÍNH =============== */

document.addEventListener('DOMContentLoaded', async function clubData() {
    try {
        const data = await fetch('/clubdata.json').then(res => res.json());
        const topCount = data.giai_dau_gan_nhat.top;
        const leaderList = [];
        for (let r = 0; r < topCount; r++) {
            const username = data.giai_dau_gan_nhat.bang_vinh_danh[r].ten_nguoi_dung;
            const playerJSON = await new Promise(resolve => {
                setTimeout(() => {
                    fetch(`https://api.chess.com/pub/player/${username}`).then(res => res.json()).then(data => resolve(data));
                }, 0);
            });
            leaderList.push(playerJSON);
        }
        const leaderBoard = document.getElementById('leaderBoard');
        for (let i = 0; i < topCount; i++) {
            const playerData = leaderList[i];
            const newElement = document.createElement('div');
            newElement.id = `top_${i + 1}`;
            newElement.className = "leaderBoard::player";
            newElement.innerHTML = `
                <img src="${playerData.avatar || ''}" class="leaderBoard::player::avatar" alt="${playerData.username || 'Player'}">
            `;
            leaderBoard.appendChild(newElement);
        }
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu leaderboard:', error);
    }
}, { once: true });

sendFeedbackButton.addEventListener('click', async () => {
    const feedback = sendFeedbackInput.value;
    if (!feedback) {
        alert('Chưa nhập nội dung kìa :3');
        return;
    }
    
    let errList = [];
    try {
        const fetching = await fetch(webhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ content: feedback, source: 'test' })
        });
        if (!fetching.ok) {
            errList.push(`Lỗi HTTP: ${fetching.status}`);
            throw new Error('HTTP_ERROR');
        } 
        const res = await fetching.text();
        alert('Đã gửi thành công!');
        sendFeedbackInput.value = '';
    } catch (err) {
        if (err.message !== 'HTTP_ERROR') {
            errList.push(`Lỗi hệ thống: ${err.message}`);
        }
        console.log(`--- Phát hiện ${errList.length} lỗi trong lần gửi này ---`);
        for (let r of errList) {
            console.log(r);
        }
    }
});

/* 
@ Copyright 2026 -  2k11dentusapa 
 - Mọi hành vi sao chép hay sử dụng code mà không có sự chho phép của tác giả đều bị nghiêm cấm!

 Last commit: "2026-06-24 16:18:58" , [GMT +7]
 */