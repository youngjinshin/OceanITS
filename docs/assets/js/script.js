// threshold 설정
var leave_threshold = 10000; // 경고 표시 판단 기준 밀리세컨드 (ms)
var pause_threshold = 0; // 보행 일시정지 판단 기준 밀리세컨드 (ms)

// 전역 변수 선언 및 초기화
var start_time; // 보행 시작 시각
var stop_time; // 보행 종료 시각
var is_start = false; // 보행 시작 여부
var leave_second = 0; // 자리 비움 시각
var start_second = 0; // 시작한지 몇 초 지났는지 변수
var stop_second = 0; // 종료한지 몇 초 지났는지 변수

// interval, timeout을 위한 타이머 변수 선언
var start_interval; // 시작한지 몇 초 지났는지 계산을 위한 interval
var stop_interval; // 종료한지 몇 초 지났는지 계산을 위한 interval
var leave_timeout; // 경고 표시 판단을 위한 timeout
var pause_timeout; // 일시정지 판단을 위한 timeout


// 모든 변수, 타이머 초기화
function clear_all() {
	clearInterval(start_interval);
	clearInterval(stop_interval);
	clearTimeout(leave_timeout);
	clearTimeout(pause_timeout);

	leave_second = 0;
	start_second = 0;
	stop_second = 0;
}

// '보행 시작' 버튼 함수
function start_walk() {
	if (!is_start) {
		clear_all();
		start_time = Date.now();
		is_start = true;
		start_interval = setInterval(start_timer, 1000);
	}
}

// 시작한지 몇 초 지났는지 계산하는 함수
function start_timer() {
	start_second += 1;
	document.getElementById("notice").innerHTML = "보행 시작한지 "+start_second+"초 지났습니다.";
}

// '보행 종료' 버튼 함수
function stop_walk() {
	if (is_start) {
		clear_all();
		stop_time = Date.now();
		is_start = false;
		pause_timeout = setTimeout(stop_action, pause_threshold); // 일시정지 판단
	}
}

// 보행 완전 종료
function stop_action() {
	clear_all();
	var time_gap = stop_time - start_time;

	// 테이블 1행에 데이터 추가 (prepend)
	var row = document.getElementById("history-table").insertRow(1);
	row.insertCell(0).innerHTML = new Date(start_time).toLocaleString();
	row.insertCell(1).innerHTML = new Date(stop_time).toLocaleString();
	row.insertCell(2).innerHTML = parseInt(time_gap/1000/60/60)+'시간 '+parseInt(time_gap/1000/60)+'분 '+parseInt(time_gap/1000)+'초';

	leave_timeout = setTimeout(leave, leave_threshold); // 경고 표시 판단
	stop_interval = setInterval(stop_timer, 1000);
}

// 종료한지 몇 초 지났는지 계산하는 함수
function stop_timer() {
	stop_second += 1;
	document.getElementById("notice").innerHTML = "보행 종료한지 "+stop_second+"초 지났습니다.";
}

function leave() {
	clear_all();
	alert("[경고] 일정 시간 보행을 안 하였습니다.\n안부를 물어보세요 !!");
}