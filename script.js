
var OffTime;
var ETE;
function UpdateBreaks() {
    ClearAllBreaks();
    OffTime = OffTimeBox.value;
    ETE = ETEBox.value;

    if (StartBreaksBox.value == "" || EndBreaksBox.value == "") {
        return;
    }
    var StartBreakET = StartBreaksBox.value;
    var EndBreakET = EndBreaksBox.value;

    //This is to exit break calculations for short flights
    var MinimumETE = AddTimes(StartBreakET, EndBreakET);
    MinimumETE = AddTimes(MinimumETE, "145");
    MinimumETE = AddTimes(MinimumETE, "130");
    if (MinimumETE > "0904") {
        return;
    }

    if (parseInt(EndBreakET) < 45) {
        //EndBreaksBox.value = 45;
        //EndBreakET = 45;
        alert("The minimum value is 45.\n\nPer the FOM:\n\nAll pilots will be summoned no later than 60 minutes and be at their duty station no later than 45 minutes prior to anticipated landing.");
    }

    var BreaksStartTime = AddTimes(StartBreakET, OffTime);
    var BreakET = new Array(6);
    BreakET[1] = StartBreakET;
    var NextBreakTime = BreaksStartTime;
    var OnTime = AddTimes(OffTime, ETE);
    var BreaksEndTime = SubtractTimes(OnTime, EndBreakET);
    var TotalTimeOnBreaks = SubtractTimes(BreaksEndTime, BreaksStartTime);
    var A_BreakLength;
    var B_BreakLength;
    var n;
    var m;
    var zTime;

    /* AAAA breaks */
    A_BreakLength = DivideTimes(TotalTimeOnBreaks, 4);
    NextBreakTime = BreaksStartTime;
    document.getElementById('zAAAA_time1').innerHTML = NextBreakTime;
    document.getElementById('AAAA_BreakLength1').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, A_BreakLength);
    BreakET[2] = AddTimes(BreakET[1], A_BreakLength);
    document.getElementById('zAAAA_time2').innerHTML = NextBreakTime;
    document.getElementById('AAAA_BreakLength2').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, A_BreakLength);
    BreakET[3] = AddTimes(BreakET[2], A_BreakLength);
    document.getElementById('zAAAA_time3').innerHTML = NextBreakTime;
    document.getElementById('AAAA_BreakLength3').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, A_BreakLength);
    BreakET[4] = AddTimes(BreakET[3], A_BreakLength);
    document.getElementById('zAAAA_time4').innerHTML = NextBreakTime;
    document.getElementById('AAAA_BreakLength4').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, A_BreakLength);
    BreakET[5] = AddTimes(BreakET[4], A_BreakLength);
    document.getElementById('zAAAA_time5').innerHTML = NextBreakTime;



    /* AABB breaks */
    A_BreakLength = ABreakLengthBox.value;
    B_BreakLength = SubtractTimes(TotalTimeOnBreaks, A_BreakLength);
    B_BreakLength = SubtractTimes(B_BreakLength, A_BreakLength);
    B_BreakLength = DivideTimes(B_BreakLength, 2);
    NextBreakTime = BreaksStartTime;
    document.getElementById('zAABB_time1').innerHTML = NextBreakTime;
    document.getElementById('AABB_BreakLength1').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, A_BreakLength);
    BreakET[2] = AddTimes(BreakET[1], A_BreakLength);
    document.getElementById('zAABB_time2').innerHTML = NextBreakTime;
    document.getElementById('AABB_BreakLength2').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, A_BreakLength);
    BreakET[3] = AddTimes(BreakET[2], A_BreakLength);
    document.getElementById('zAABB_time3').innerHTML = NextBreakTime;
    document.getElementById('AABB_BreakLength3').innerHTML = Colonize(B_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, B_BreakLength);
    BreakET[4] = AddTimes(BreakET[3], B_BreakLength);
    document.getElementById('zAABB_time4').innerHTML = NextBreakTime;
    document.getElementById('AABB_BreakLength4').innerHTML = Colonize(B_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, B_BreakLength);
    BreakET[5] = AddTimes(BreakET[4], B_BreakLength);
    document.getElementById('zAABB_time5').innerHTML = NextBreakTime;


    /* ABBA breaks */

    NextBreakTime = BreaksStartTime;
    document.getElementById('zABBA_time1').innerHTML = NextBreakTime;
    document.getElementById('ABBA_BreakLength1').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, A_BreakLength);
    BreakET[2] = AddTimes(BreakET[1], A_BreakLength);
    document.getElementById('zABBA_time2').innerHTML = NextBreakTime;
    document.getElementById('ABBA_BreakLength2').innerHTML = Colonize(B_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, B_BreakLength);
    BreakET[3] = AddTimes(BreakET[2], B_BreakLength);
    document.getElementById('zABBA_time3').innerHTML = NextBreakTime;
    document.getElementById('ABBA_BreakLength3').innerHTML = Colonize(B_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, B_BreakLength);
    BreakET[4] = AddTimes(BreakET[3], B_BreakLength);
    document.getElementById('zABBA_time4').innerHTML = NextBreakTime;
    document.getElementById('ABBA_BreakLength4').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, A_BreakLength);
    BreakET[5] = AddTimes(BreakET[4], A_BreakLength);
    document.getElementById('zABBA_time5').innerHTML = NextBreakTime;


    /* 3 man breaks */
    var LandPilotBreak;
    var MonitorPilotBreak;
    var ReliefPilotBreak;
    var Alert3ManMessage = "";
    var MinLPBreak = AddTimes(document.getElementById("MinLPBox").value, "0");
    var MinMonitorBreak = AddTimes(document.getElementById("MinMonitorBox").value, "0");
    document.getElementById("Alert3Man").innerHTML = Alert3ManMessage;
    A_BreakLength = DivideTimes(TotalTimeOnBreaks, 3);
    var Break1Pilot = document.getElementById("Break1Pilot").value;
    var Break2Pilot = document.getElementById("Break2Pilot").value;
    var Break3Pilot = document.getElementById("Break3Pilot").value;

    if (Break1Pilot == Break2Pilot || Break1Pilot == Break3Pilot || Break2Pilot == Break3Pilot || Break3Pilot == Break1Pilot) {
        alert("You have the same pilot assigned to two breaks in the three pilot breaks");
        return;
    }

    if (MinLPBreak < "0145") {
        alert("The minimum landing pilot break should be at least 145 to satisfy FAA requirements.\n\nThe ability to adjust this minimum is only meant to allow an increase in this value.");
    }
    if (MinMonitorBreak < "0130") {
        alert("The minimum monitoring pilot break should be at least 130 to satisfy FAA requirements.\n\nThe ability to adjust this minimum is only meant to allow an increase in this value.");
    }
    if (A_BreakLength > MinLPBreak) {
        LandPilotBreak = A_BreakLength;
        ReliefPilotBreak = A_BreakLength;
        MonitorPilotBreak = A_BreakLength;
    }
    else {
        LandPilotBreak = MinLPBreak;
        Alert3ManMessage = "Landing pilot extended to satisfy min break."
        document.getElementById("Alert3Man").innerHTML = Alert3ManMessage;
        MonitorPilotBreak = SubtractTimes(TotalTimeOnBreaks, LandPilotBreak);
        MonitorPilotBreak = DivideTimes(MonitorPilotBreak, 2);
        ReliefPilotBreak = MonitorPilotBreak;
        if (MonitorPilotBreak < MinMonitorBreak) {
            MonitorPilotBreak = MinMonitorBreak;
            Alert3ManMessage += "<br />Monitor pilot extended satisfy min break.";
            document.getElementById("Alert3Man").innerHTML = Alert3ManMessage;
            ReliefPilotBreak = SubtractTimes(TotalTimeOnBreaks, AddTimes(MonitorPilotBreak, LandPilotBreak));
        }
    }

    document.getElementById('zAAA_time1').innerHTML = BreaksStartTime;

    switch (Break1Pilot) {
        case "Relief":
            A_BreakLength = ReliefPilotBreak;
            break;
        case "Land":
            A_BreakLength = LandPilotBreak;
            break;
        case "Monitor":
            A_BreakLength = MonitorPilotBreak;
            break;
    }
    document.getElementById('AAA_BreakLength1').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(BreaksStartTime, A_BreakLength);
    document.getElementById('zAAA_time2').innerHTML = NextBreakTime;
    BreakET[2] = AddTimes(BreakET[1], A_BreakLength);

    switch (Break2Pilot) {
        case "Relief":
            A_BreakLength = ReliefPilotBreak;
            break;
        case "Land":
            A_BreakLength = LandPilotBreak;
            break;
        case "Monitor":
            A_BreakLength = MonitorPilotBreak;
            break;
    }
    document.getElementById('AAA_BreakLength2').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, A_BreakLength);
    document.getElementById('zAAA_time3').innerHTML = NextBreakTime;
    BreakET[3] = AddTimes(BreakET[2], A_BreakLength);

    switch (Break3Pilot) {
        case "Relief":
            A_BreakLength = ReliefPilotBreak;
            break;
        case "Land":
            A_BreakLength = LandPilotBreak;
            break;
        case "Monitor":
            A_BreakLength = MonitorPilotBreak;
            break;
    }
    document.getElementById('AAA_BreakLength3').innerHTML = Colonize(A_BreakLength);
    NextBreakTime = AddTimes(NextBreakTime, A_BreakLength);
    document.getElementById('zAAA_time4').innerHTML = NextBreakTime;
    BreakET[4] = AddTimes(BreakET[3], A_BreakLength);

}
function Clear3Man() {
    for (n = 1; n <= 4; n++) {
        zTime = document.getElementById('zAAA_time' + n).innerHTML;
        document.getElementById('zAAA_time' + n).innerHTML = "-";

    };
    for (n = 1; n <= 3; n++) {
        document.getElementById('AAA_BreakLength' + n).innerHTML = "-";
    };
}

function ClearAllBreaks() {
    Clear3Man();
    for (n = 1; n <= 5; n++) {
        zTime = document.getElementById('zAAAA_time' + n).innerHTML;
        document.getElementById('zAAAA_time' + n).innerHTML = "-";
    };
    for (n = 1; n <= 4; n++) {
        document.getElementById('AAAA_BreakLength' + n).innerHTML = "-";
    };
    for (n = 1; n <= 5; n++) {
        zTime = document.getElementById('zAABB_time' + n).innerHTML;
        document.getElementById('zAABB_time' + n).innerHTML = "-";
    };
    for (n = 1; n <= 4; n++) {
        document.getElementById('AABB_BreakLength' + n).innerHTML = "-";
    };
    for (n = 1; n <= 5; n++) {
        zTime = document.getElementById('zABBA_time' + n).innerHTML;
        document.getElementById('zABBA_time' + n).innerHTML = "-";
    };
    for (n = 1; n <= 4; n++) {
        document.getElementById('ABBA_BreakLength' + n).innerHTML = "-";
    };
}




function AddTimes(Time1, Time2) {
    Time1 = DeApple(Time1);
    Time2 = DeApple(Time2);
    var TotalTimeString;
    var totalminutes;
    var totalhours;
    Time1 = MakeLen4String(Time1);
    Time2 = MakeLen4String(Time2);
    totalminutes = Time1.substr(2, 2) * 1 + Time2.substr(2, 2) * 1;
    totalhours = Time1.substr(0, 2) * 1 + Time2.substr(0, 2) * 1;
    while (totalminutes >= 60) {
        totalminutes = totalminutes - 60;
        totalhours = totalhours + 1;
    };
    while (totalhours >= 24) {
        totalhours = totalhours - 24;
    };
    TotalTimeString = String(totalminutes);
    while (TotalTimeString.length < 2) {
        TotalTimeString = "0" + TotalTimeString;
    };
    TotalTimeString = String(totalhours) + TotalTimeString;
    TotalTimeString = MakeLen4String(TotalTimeString);
    return TotalTimeString;
}
function DeApple(Time) {
    //This is to deal with iOS automatically adding hyperlinks for times.
    if (Time.indexOf(">") > 0) {
        Time = Time.substring(Time.indexOf(">") + 1);
        Time = Time.substring(0, Time.indexOf("<"));
    }
    return Time;
}
function SubtractTimes(Time1, Time2) {
    var TotalTimeString;
    var totalminutes;
    var totalhours;
    Time1 = MakeLen4String(Time1);
    Time2 = MakeLen4String(Time2);
    totalminutes = Time1.substr(2, 2) * 1 - Time2.substr(2, 2) * 1;
    totalhours = Time1.substr(0, 2) * 1 - Time2.substr(0, 2) * 1;
    while (totalminutes >= 60) {
        totalminutes = totalminutes - 60;
        totalhours = totalhours + 1;
    };
    while (totalminutes < 0) {
        totalminutes = totalminutes + 60;
        totalhours = totalhours - 1;
    };
    while (totalhours >= 24) {
        totalhours = totalhours - 24;
    };
    while (totalhours < 0) {
        totalhours = totalhours + 24;
    };
    TotalTimeString = String(totalminutes);
    while (TotalTimeString.length < 2) {
        TotalTimeString = "0" + TotalTimeString;
    };
    TotalTimeString = String(totalhours) + TotalTimeString;
    TotalTimeString = MakeLen4String(TotalTimeString);
    return TotalTimeString;
}
function DivideTimes(Time1, Divisor) {
    var TotalTimeString;
    var totalminutes;
    var totalhours;
    Time1 = MakeLen4String(Time1);
    totalhours = 0
    totalminutes = Time1.substr(2, 2) * 1 + Time1.substr(0, 2) * 60;
    totalminutes = Math.round(totalminutes / Divisor);
    while (totalminutes >= 60) {
        totalminutes = totalminutes - 60;
        totalhours = totalhours + 1;
    };
    while (totalhours >= 24) {
        totalhours = totalhours - 24;
    };
    TotalTimeString = String(totalminutes);
    while (TotalTimeString.length < 2) {
        TotalTimeString = "0" + TotalTimeString;
    };
    TotalTimeString = String(totalhours) + TotalTimeString;
    TotalTimeString = MakeLen4String(TotalTimeString);
    return TotalTimeString;
}

function Time0000ToDecimalMinutes(Time1) {
    var totalminutes;
    Time1 = MakeLen4String(Time1);
    totalminutes = Time1.substr(2, 2) * 1 + Time1.substr(0, 2) * 60;
    return totalminutes;
}

function MakeLen4String(sTime) {
    sTime = String(sTime);
    sTime = sTime.replace(":", "");
    while (sTime.length < 4) {
        sTime = "0" + sTime;
    };
    return sTime;
}
function Colonize(sTime) {
    sTime = String(sTime);
    sTime = sTime.replace(":", "");
    while (sTime.length < 2) {
        sTime = "0" + sTime;
    };
    var n = sTime.length;
    sTime = sTime.substr(0, n - 2) + ":" + sTime.substr(n - 2, 2);
    while (sTime.substr(0, 1) == "0")
    { sTime = sTime.substr(1, sTime.length - 1); }
    return sTime;
}
function GetCurrentTime() {
    var CurrentUTC = new Date();
    CurrentUTC.setHours(CurrentUTC.getUTCHours());
    CurrentUTC.setMinutes(CurrentUTC.getUTCMinutes());
    var strUTC_hours = CurrentUTC.getHours().toString();
    var strUTC_minutes = CurrentUTC.getMinutes().toString();
    while (strUTC_hours.length < 2) {
        strUTC_hours = "0" + strUTC_hours;
    }
    while (strUTC_minutes.length < 2) {
        strUTC_minutes = "0" + strUTC_minutes;
    }
    var strCurrentUTC = strUTC_hours + strUTC_minutes
    document.getElementById('CurrentUTC').innerHTML = strCurrentUTC;
    document.getElementById('CurrentDep').innerHTML = AddTimes(strCurrentUTC, depUTC_offset);
    document.getElementById('CurrentArr').innerHTML = AddTimes(strCurrentUTC, arrUTC_offset);
}