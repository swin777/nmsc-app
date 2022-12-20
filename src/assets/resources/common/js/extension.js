/*
 * @(#)extension.js 1.0 2012/08/01
 * 
 * COPYRIGHT (C) 2008 GALLOPSYS CO., LTD.
 * ALL RIGHTS RESERVED.
 */

/*
 * 다음과 같은 객체를 확장한다.
 *
 * =============================================================================
 * Name             Description
 * -----------------------------------------------------------------------------
 * String           문자를 조작하는 기능을 제공한다.
 * =============================================================================
 *
 * 다음과 같은 함수를 추가한다.
 *
 * String:
 * =============================================================================
 * Name             Description
 * -----------------------------------------------------------------------------
 * meta             문자열의 정규식 특수문자를 치환한다.
 * strip            문자열의 전역의 특정문자를 제거한다.
 * pad              문자열의 측면에 특정문자를 덧붙인다.
 * lpad             문자열의 좌측에 특정문자를 덧붙인다.
 * rpad             문자열의 우측에 특정문자를 덧붙인다.
 * trim             문자열의 측면의 특정문자를 제거한다.
 * btrim            문자열의 양측의 특정문자를 제거한다.
 * ltrim            문자열의 좌측의 특정문자를 제거한다.
 * rtrim            문자열의 우측의 특정문자를 제거한다.
 * bytes            문자열의 바이트 배열길이를 반환한다.
 * ellipsis         문자열의 특정한 길이만큼만 보여준다.
 * toNumeric        문자열의 숫자만 반환한다.
 * toInteger        문자열을 정수로 변환한다.
 * toDecimal        문자열을 실수로 변환한다.
 * toCurrency       문자열을 통화로 변환한다.
 * toDate           문자열을 날짜로 변환한다.
 * toTime           문자열을 시간으로 변환한다.
 * toResRegNo       문자열을 주민등록번호로 변환한다.
 * toCorRegNo       문자열을 법인등록번호로 변환한다.
 * toForRegNo       문자열을 외국인등록번호로 변환한다.
 * toBizRegNo       문자열을 사업자등록번호로 변환한다.
 * toPhone          문자열을 유선전화번호로 변환한다.
 * toMobile         문자열을 무선전화번호로 변환한다.
 * toPostcode       문자열을 배달우편번호로 변환한다.
 * toMacAddress     문자열을 맥주소로 변환한다.
 * isBlank          문자열이 공백인지 확인한다.
 * isLength         문자열의 캐릭터 배열길이가 최소값과 최대값 사이인지 확인한다.
 * isBytes          문자열의 바이트 배열길이가 최소값과 최대값 사이인지 확인한다.
 * isNumeric        문자열이 숫자인지 확인한다.
 * isInteger        문자열이 정수인지 확인한다.
 * isDecimal        문자열이 실수인지 확인한다.
 * isDate           문자열이 날짜인지 확인한다.
 * isTime           문자열이 시간인지 확인한다.
 * isAlpha          문자열이 영어인지 확인한다.
 * isAlphaNumeric   문자열이 영어와 숫자인지 확인한다.
 * isResRegNo       문자열이 주민등록번호인지 확인한다.
 * isCorRegNo       문자열이 법인등록번호인지 확인한다.
 * isForRegNo       문자열이 외국인등록번호인지 확인한다.
 * isBizRegNo       문자열이 사업자등록번호인지 확인한다.
 * isEmail          문자열이 전자우편주소인지 확인한다.
 * isPhone          문자열이 유선전화번호인지 확인한다.
 * isMobile         문자열이 무선전화번호인지 확인한다.
 * isIpAddress      문자열이 아이피주소인지 확인한다.
 * isMacAddress     문자열이 맥주소인지 확인한다.
 * isImageFile      문자열이 이미지 파일인지 확인한다.
 * =============================================================================
 *
 * @author 김은삼
 * @version 1.0 2012/08/01
 */

/**
 * 문자열의 정규식 특수문자를 치환한다.
 *
 * Usage: string.meta()
 */
 String.prototype.meta = function() {
    var replace = "";
    
    var pattern = new RegExp("([\\$\\(\\)\\*\\+\\.\\[\\]\\?\\\\\\^\\{\\}\\|]{1})", "");
    
    for (var i = 0; i < this.length; i++) {
        if (pattern.test(this.charAt(i))) {
            replace = replace + this.charAt(i).replace(pattern, "\\$1");
        }
        else {
            replace = replace + this.charAt(i);
        }
    }
    
    return replace;
};

/**
 * 문자열의 전역의 특정문자를 제거한다.
 *
 * Usage: string.strip(character)
 */
String.prototype.strip = function(character) {
    if (character.isBlank()) {
        return this;
    }

    var pattern = new RegExp("[" + character.meta() + "]", "g");

    return this.replace(pattern, "");
};

/**
 * 문자열의 측면에 특정문자를 덧붙인다.
 *
 * Usage: string.pad(size)
 *        string.pad(size, character)
 *        string.pad(size, character, "left|right")
 */
String.prototype.pad = function(size) {
    var character = arguments.length > 1 ? arguments[1] : "0";
    var direction = arguments.length > 2 ? arguments[2] : "left";

    switch (direction) {
        case "left":
            return this.lpad(size, character);
        case "right":
            return this.rpad(size, character);
    }

    return this;
};

/**
 * 문자열의 좌측에 특정문자를 덧붙인다.
 *
 * Usage: string.lpad(size)
 *        string.lpad(size, character)
 */
String.prototype.lpad = function(size) {
    var character = arguments.length > 1 ? arguments[1] : "0";

    var append = "";

    if (this.length < size) {
        for (var i = 0; i < size - this.length; i++) {
            append = append + character;
        }
    }

    return append + this;
};

/**
 * 문자열의 우측에 특정문자를 덧붙인다.
 *
 * Usage: string.rpad(size)
 *        string.rpad(size, character)
 */
String.prototype.rpad = function(size) {
    var character = arguments.length > 1 ? arguments[1] : "0";

    var append = "";

    if (this.length < size) {
        for (var i = 0; i < size - this.length; i++) {
            append = append + character;
        }
    }

    return this + append;
};

/**
 * 문자열의 측면의 특정문자를 제거한다.
 *
 * Usage: string.trim()
 *        string.trim(character)
 *        string.trim(character, "both|left|right")
 */
String.prototype.trim = function() {
    var character = arguments.length > 0 ? arguments[0] : "\\s";
    var direction = arguments.length > 1 ? arguments[1] : "both";

    switch (direction) {
        case "both":
            return this.btrim(character);
        case "left":
            return this.ltrim(character);
        case "right":
            return this.rtrim(character);
    }

    return this;
};

/**
 * 문자열의 양측의 특정문자를 제거한다.
 *
 * Usage: string.btrim()
 *        string.btrim(character)
 */
String.prototype.btrim = function() {
    var character = arguments.length > 0 ? arguments[0] : "\\s";

    var pattern = new RegExp("(^" + (character == "\\s" ? character : character.meta()) + "*)|(" + (character == "\\s" ? character : character.meta()) + "*$)", "g");

    return this.replace(pattern, "");
};

/**
 * 문자열의 좌측의 특정문자를 제거한다.
 *
 * Usage: string.ltrim()
 *        string.ltrim(character)
 */
String.prototype.ltrim = function() {
    var character = arguments.length > 0 ? arguments[0] : "\\s";

    var pattern = new RegExp("(^" + (character == "\\s" ? character : character.meta()) + "*)", "g");

    return this.replace(pattern, "");
};

/**
 * 문자열의 우측의 특정문자를 제거한다.
 *
 * Usage: string.rtrim()
 *        string.rtrim(character)
 */
String.prototype.rtrim = function() {
    var character = arguments.length > 0 ? arguments[0] : "\\s";

    var pattern = new RegExp("(" + (character == "\\s" ? character : character.meta()) + "*$)", "g");

    return this.replace(pattern, "");
};

/**
 * 문자열의 바이트 배열길이를 반환한다.
 *
 * Usage: string.bytes()
 */
String.prototype.bytes = function() {
    var pattern = new RegExp("%u", "g");

    return this.length + (escape(this) + "%u").match(pattern).length - 1;
};

/**
 * 문자열의 특정한 길이만큼만 보여준다.
 *
 * Usage: string.ellipsis(length)
 *        string.ellipsis(length, suffix)
 */
String.prototype.ellipsis = function(length) {
    var suffix = arguments.length > 1 ? arguments[1] : "...";
    
    if (this.length > length) {
        return this.substring(0, length) + suffix;
    }

    return this;
};

/**
 * 문자열의 숫자만 반환한다.
 *
 * Usage: string.toNumeric()
 */
String.prototype.toNumeric = function() {
    var pattern = new RegExp("[^0-9]", "g");
    
    return this.replace(pattern, "");
};

/**
 * 문자열을 정수로 변환한다.
 *
 * Usage: string.toInteger()
 *        string.toInteger(radix)
 */
String.prototype.toInteger = function() {
    var radix = arguments.length > 0 ? arguments[0] : 10;

    var pattern = new RegExp("[^\\-0-9\\.]", "g");

    var value = this.replace(pattern, "");

    return parseInt(value, radix);
};

/**
 * 문자열을 실수로 변환한다.
 *
 * Usage: string.toDecimal()
 *        string.toDecimal(radix)
 */
String.prototype.toDecimal = function() {
    var radix = arguments.length > 0 ? arguments[0] : 10;

    var pattern = new RegExp("[^\\-0-9\\.]", "g");

    var value = this.replace(pattern, "");

    return parseFloat(value, radix);
};

/**
 * 문자열을 통화로 변환한다.
 *
 * Usage: string.toCurrency()
 */
String.prototype.toCurrency = function() {
    var extra = "";

    var value = this.toDecimal().toString();

    var index = value.indexOf(".");

    if (index > 0) {
        extra = value.substring(index);
        value = value.substring(0, index);
    }

    var pattern = new RegExp("(\\-?[0-9]+)([0-9]{3})", "");

    while (pattern.test(value)) {
        value = value.replace(pattern, "$1,$2");
    }

    return value + extra;
};

/**
 * 문자열을 날짜로 변환한다.
 *
 * Usage: string.toDateTime(parsePattern, formatPattern)
 *
 * Pattern:
 * =============================================================================
 * Letters                  Component
 * -----------------------------------------------------------------------------
 * yyyy                     Year
 * MM                       Month
 * dd                       Date
 * HH						Hour
 * mi						Minute
 * =============================================================================
 */
String.prototype.toDateTime = function(parsePattern, formatPattern) {
    if (this.length != parsePattern.length) {
        return this;
    }

    var yIndex = parsePattern.indexOf("yyyy");
    var mIndex = parsePattern.indexOf("MM");
    var dIndex = parsePattern.indexOf("dd");
    var hIndex = parsePattern.indexOf("HH");
    var miIndex = parsePattern.indexOf("mi");

    var yValue = this.substring(yIndex, yIndex + 4);
    var mValue = this.substring(mIndex, mIndex + 2);
    var dValue = this.substring(dIndex, dIndex + 2);
    var hValue = this.substring(hIndex, hIndex + 2);
    var miValue = this.substring(miIndex, miIndex + 2);

    return formatPattern.replace("yyyy", yValue).replace("MM", mValue).replace("dd", dValue).replace("HH", hValue).replace("mi", miValue);
};

/**
 * 문자열을 날짜로 변환한다.
 *
 * Usage: string.toDate(parsePattern, formatPattern)
 *
 * Pattern:
 * =============================================================================
 * Letters                  Component
 * -----------------------------------------------------------------------------
 * yyyy                     Year
 * MM                       Month
 * dd                       Date
 * =============================================================================
 */
String.prototype.toDate = function(parsePattern, formatPattern) {
    if (this.length != parsePattern.length) {
        return this;
    }
    
    var yIndex = parsePattern.indexOf("yyyy");
    var mIndex = parsePattern.indexOf("MM");
    var dIndex = parsePattern.indexOf("dd");
    
    var yValue = this.substring(yIndex, yIndex + 4);
    var mValue = this.substring(mIndex, mIndex + 2);
    var dValue = this.substring(dIndex, dIndex + 2);
    
    return formatPattern.replace("yyyy", yValue).replace("MM", mValue).replace("dd", dValue);
};

/**
 * 문자열을 시간으로 변환한다.
 *
 * Usage: string.toTime(parsePattern, formatPattern)
 *
 * Pattern:
 * =============================================================================
 * Letters                  Component
 * -----------------------------------------------------------------------------
 * HH                       Hour
 * mm                       Minute
 * SS                       Second
 * =============================================================================
 */
String.prototype.toTime = function(parsePattern, formatPattern) {
    if (this.length != parsePattern.length) {
        return this;
    }
    
    var hIndex = parsePattern.indexOf("HH");
    var mIndex = parsePattern.indexOf("mm");
    var sIndex = parsePattern.indexOf("SS");
    
    var hValue = hIndex >= 0 ? this.substring(hIndex, hIndex + 2) : "";
    var mValue = mIndex >= 0 ? this.substring(mIndex, mIndex + 2) : "";
    var sValue = sIndex >= 0 ? this.substring(sIndex, sIndex + 2) : "";
    
    return formatPattern.replace("HH", hValue).replace("mm", mValue).replace("SS", sValue);
};

/**
 * 문자열을 주민등록번호로 변환한다.
 *
 * Usage: string.toResRegNo()
 *        string.toResRegNo(delimiter)
 */
String.prototype.toResRegNo = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var resRegNo = this.toNumeric();

    if (resRegNo.length > 6) {
        resRegNo = resRegNo.substring(0, 6) + delimiter + resRegNo.substring(6);
    }

    return resRegNo;
};

/**
 * 문자열을 법인등록번호로 변환한다.
 *
 * Usage: string.toCorRegNo()
 *        string.toCorRegNo(delimiter)
 */
String.prototype.toCorRegNo = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var corRegNo = this.toNumeric();

    if (corRegNo.length > 6) {
        corRegNo = corRegNo.substring(0, 6) + delimiter + corRegNo.substring(6);
    }

    return corRegNo;
};

/**
 * 문자열을 외국인등록번호로 변환한다.
 *
 * Usage: string.toForRegNo()
 *        string.toForRegNo(delimiter)
 */
String.prototype.toForRegNo = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var forRegNo = this.toNumeric();

    if (forRegNo.length > 6) {
        forRegNo = forRegNo.substring(0, 6) + delimiter + forRegNo.substring(6);
    }

    return forRegNo;
};

/**
 * 문자열을 사업자등록번호로 변환한다.
 *
 * Usage: string.toBizRegNo()
 *        string.toBizRegNo(delimiter)
 */
String.prototype.toBizRegNo = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var bizRegNo = this.toNumeric();

    if (bizRegNo.length > 5) {
        bizRegNo = bizRegNo.substring(0, 3) + delimiter + bizRegNo.substring(3, 5) + delimiter + bizRegNo.substring(5);
    }
    else if (bizRegNo.length > 3) {
        bizRegNo = bizRegNo.substring(0, 3) + delimiter + bizRegNo.substring(3);
    }

    return bizRegNo;
};

/**
 * 문자열을 유선전화번호로 변환한다.
 *
 * Usage: string.toPhone()
 *        string.toPhone(delimiter)
 */
String.prototype.toPhone = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var phoneNo = this.toNumeric();

    if (phoneNo.indexOf("02") == 0) {
        if (phoneNo.length > 9) {
            phoneNo = phoneNo.substring(0, 2) + delimiter + phoneNo.substring(2, 6) + delimiter + phoneNo.substring(6);
        }
        else if (phoneNo.length > 5) {
            phoneNo = phoneNo.substring(0, 2) + delimiter + phoneNo.substring(2, 5) + delimiter + phoneNo.substring(5);
        }
        else if (phoneNo.length > 2) {
            phoneNo = phoneNo.substring(0, 2) + delimiter + phoneNo.substring(2);
        }
    }
    else {
        if (phoneNo.length > 10) {
            phoneNo = phoneNo.substring(0, 3) + delimiter + phoneNo.substring(3, 7) + delimiter + phoneNo.substring(7);
        }
        else if (phoneNo.length > 6) {
            phoneNo = phoneNo.substring(0, 3) + delimiter + phoneNo.substring(3, 6) + delimiter + phoneNo.substring(6);
        }
        else if (phoneNo.length > 3) {
            phoneNo = phoneNo.substring(0, 3) + delimiter + phoneNo.substring(3);
        }
    }

    return phoneNo;
};

/**
 * 문자열을 무선전화번호로 변환한다.
 *
 * Usage: string.toMobile()
 *        string.toMobile(delimiter)
 */
String.prototype.toMobile = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var mobileNo = this.toNumeric();

    if (mobileNo.length > 10) {
        mobileNo = mobileNo.substring(0, 3) + delimiter + mobileNo.substring(3, 7) + delimiter + mobileNo.substring(7);
    }
    else if (mobileNo.length > 6) {
        mobileNo = mobileNo.substring(0, 3) + delimiter + mobileNo.substring(3, 6) + delimiter + mobileNo.substring(6);
    }
    else if (mobileNo.length > 3) {
        mobileNo = mobileNo.substring(0, 3) + delimiter + mobileNo.substring(3);
    }

    return mobileNo;
};

/**
 * 문자열을 배달우편번호로 변환한다.
 *
 * Usage: string.toPostcode()
 *        string.toPostcode(delimiter)
 */
String.prototype.toPostcode = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var postcode = this.toNumeric();

    if (postcode.length == 6) {
        postcode = postcode.substring(0, 3) + delimiter + postcode.substring(3);
    }

    return postcode;
};

/**
 * 문자열을 맥주소로 변환한다.
 *
 * Usage: string.toMacAddress()
 *        string.toMacAddress(delimiter)
 */
String.prototype.toMacAddress = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "-";
    
    var pattern = new RegExp("[^0-9a-fA-F]", "g");
    
    var address = this.replace(pattern, "").toUpperCase();
    
    if (address.length == 12) {
        address = address.substring( 0,  2) + delimiter
                + address.substring( 2,  4) + delimiter
                + address.substring( 4,  6) + delimiter
                + address.substring( 6,  8) + delimiter
                + address.substring( 8, 10) + delimiter
                + address.substring(10, 12);
        
        return address;
    }
    
    return this;
};

/**
 * 문자열이 공백인지 확인한다.
 *
 * Usage: string.isBlank()
 */
String.prototype.isBlank = function() {
    return this.trim() == "";
};

/**
 * 문자열의 캐릭터 배열길이가 최소값과 최대값 사이인지 확인한다.
 *
 * Usage: string.isLength()
 *        string.isLength(minimum)
 *        string.isLength(minimum, maximum)
 */
String.prototype.isLength = function() {
    var minimum = arguments.length > 0 ? arguments[0] : 0;
    var maximum = arguments.length > 1 ? arguments[1] : 0;

    if (minimum > 0 && this.length < minimum) {
        return false;
    }

    if (maximum > 0 && this.length > maximum) {
        return false;
    }

    return true;
};

/**
 * 문자열의 바이트 배열길이가 최소값과 최대값 사이인지 확인한다.
 *
 * Usage: string.isBytes()
 *        string.isBytes(minimum)
 *        string.isBytes(minimum, maximum)
 */
String.prototype.isBytes = function() {
    var minimum = arguments.length > 0 ? arguments[0] : 0;
    var maximum = arguments.length > 1 ? arguments[1] : 0;

    if (minimum > 0 && this.bytes() < minimum) {
        return false;
    }

    if (maximum > 0 && this.bytes() > maximum) {
        return false;
    }

    return true;
};

/**
 * 문자열이 숫자인지 확인한다.
 *
 * Usage: string.isNumeric()
 */
String.prototype.isNumeric = function() {
    var pattern = new RegExp("^[0-9]+$", "");

    return pattern.test(this);
};

/**
 * 문자열이 정수인지 확인한다.
 *
 * Usage: string.isInteger()
 */
String.prototype.isInteger = function() {
    var pattern = new RegExp("^\\-?[0-9]+$", "");

    return pattern.test(this);
};

/**
 * 문자열이 실수인지 확인한다.
 *
 * Usage: string.isDecimal()
 */
String.prototype.isDecimal = function() {
    var pattern = new RegExp("^\\-?[0-9]*(\\.[0-9]*)?$", "");

    return pattern.test(this);
};

/**
 * 문자열이 날짜인지 확인한다.
 *
 * Usage: string.isDate(pattern)
 *
 * Pattern:
 * =============================================================================
 * Letters                  Component
 * -----------------------------------------------------------------------------
 * yyyy                     Year
 * MM                       Month
 * dd                       Date
 * =============================================================================
 */
String.prototype.isDate = function(pattern) {
    if (this.length != pattern.length) {
        return false;
    }

    var yIndex = pattern.indexOf("yyyy");
    var mIndex = pattern.indexOf("MM");
    var dIndex = pattern.indexOf("dd");
    
    var yValue = parseInt(this.substring(yIndex, yIndex + 4), 10);
    var mValue = parseInt(this.substring(mIndex, mIndex + 2), 10);
    var dValue = parseInt(this.substring(dIndex, dIndex + 2), 10);
    
    if (yValue < 1) {
        return false;
    }
    if (mValue < 1) {
        return false;
    }
    if (mValue > 12) {
        return false;
    }
    if (dValue < 1) {
        return false;
    }
    if (dValue > 31) {
        return false;
    }
    
    switch (mValue) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return dValue <= 31;
        case 4:
        case 6:
        case 9:
        case 11:
            return dValue <= 30;
        case 2:
            if (((yValue % 4 == 0) && (yValue % 100 != 0)) || (yValue % 400 == 0)) {
                return dValue <= 29;
            }
            
            return dValue <= 28;
    }
    
    return false;
};

/**
 * 문자열이 시간인지 확인한다.
 *
 * Usage: string.isTime(pattern)
 *
 * Pattern:
 * =============================================================================
 * Letters                  Component
 * -----------------------------------------------------------------------------
 * HH                       Hour
 * mm                       Minute
 * SS                       Second
 * =============================================================================
 */
String.prototype.isTime = function(pattern) {
    if (this.length != pattern.length) {
        return false;
    }

    var hIndex = pattern.indexOf("HH");
    var mIndex = pattern.indexOf("mm");
    var sIndex = pattern.indexOf("SS");
    
    var hValue = hIndex >= 0 ? parseInt(this.substring(hIndex, hIndex + 2), 10) : 0;
    var mValue = mIndex >= 0 ? parseInt(this.substring(mIndex, mIndex + 2), 10) : 0;
    var sValue = sIndex >= 0 ? parseInt(this.substring(sIndex, sIndex + 2), 10) : 0;
    
    if (hValue < 0) {
        return false;
    }
    if (hValue > 23) {
        return false;
    }
    if (mValue < 0) {
        return false;
    }
    if (mValue > 59) {
        return false;
    }
    if (sValue < 0) {
        return false;
    }
    if (sValue > 59) {
        return false;
    }
    
    return true;
};

/**
 * 문자열이 영어인지 확인한다.
 *
 * Usage: string.isAlpha()
 *        string.isAlpha(ignores)
 */
String.prototype.isAlpha = function() {
    var ignores = arguments.length > 0 ? arguments[0] : "";

    var pattern = new RegExp("^[a-zA-Z]+$", "");

    return pattern.test(this.strip(ignores));
};

/**
 * 문자열이 영어와 숫자인지 확인한다.
 *
 * Usage: string.isAlphaNumeric()
 *        string.isAlphaNumeric(ignores)
 */
String.prototype.isAlphaNumeric = function() {
    var ignores = arguments.length > 0 ? arguments[0] : "";

    var pattern = new RegExp("^[0-9a-zA-Z]+$", "");

    return pattern.test(this.strip(ignores));
};

/**
 * 문자열이 주민등록번호인지 확인한다.
 *
 * Usage: string.isResRegNo()
 *        string.isResRegNo(delimiter)
 */
String.prototype.isResRegNo = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";
    
    var pattern = new RegExp("[0-9]{2}[01]{1}[0-9]{1}[0123]{1}[0-9]{1}" + delimiter.meta() + "[1234]{1}[0-9]{6}$", "");
    
    var resRegNo = this.match(pattern);
    
    if (resRegNo == null) {
        return false;
    }
    
    resRegNo = resRegNo.toString().toNumeric();
    
    var year = resRegNo.substring(0, 2);
    
    switch (resRegNo.charAt(6)) {
        case "1":
        case "2":
            year = "19" + year;
            break;
        case "3":
        case "4":
            year = "20" + year;
            break;
        default:
            return false;
    }
    
    var month = resRegNo.substring(2, 4);
    
    var date = resRegNo.substring(4, 6);
    
    var yearMonthDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(date, 10));
    
    if (yearMonthDate.getFullYear() != parseInt(year, 10)) {
        return false;
    }
    if (yearMonthDate.getMonth() != parseInt(month, 10) - 1) {
        return false;
    }
    if (yearMonthDate.getDate() != parseInt(date, 10)) {
        return false;
    }
    
    var sum = 0;
    
    var mod = [ 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 ];
    
    for (var i = 0; i < 12; i++) {
        sum = sum + (parseInt(resRegNo.charAt(i), 10) * mod[i]);
    }
    
    return (11 - sum % 11) % 10 == parseInt(resRegNo.charAt(12), 10);
};

/**
 * 문자열이 법인등록번호인지 확인한다.
 *
 * Usage: string.isCorRegNo()
 *        string.isCorRegNo(delimiter)
 */
String.prototype.isCorRegNo = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var pattern = new RegExp("[0-9]{6}" + delimiter.meta() + "[0-9]{7}$", "");

    var corRegNo = this.match(pattern);

    if (corRegNo == null) {
        return false;
    }

    corRegNo = corRegNo.toString().toNumeric();

    var sum = 0;

    var mod = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];

    for (var i = 0; i < 12; i++) {
        sum = sum + (parseInt(corRegNo.charAt(i), 10) * mod[i]);
    }

    return (10 - sum % 10) % 10 == parseInt(corRegNo.charAt(12), 10);
};

/**
 * 문자열이 외국인등록번호인지 확인한다.
 *
 * Usage: string.isForRegNo()
 *        string.isForRegNo(delimiter)
 */
String.prototype.isForRegNo = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var pattern = new RegExp("[0-9]{2}[01]{1}[0-9]{1}[0123]{1}[0-9]{1}" + delimiter.meta() + "[5678]{1}[0-9]{1}[02468]{1}[0-9]{2}[6789]{1}[0-9]{1}$", "");

    var forRegNo = this.match(pattern);

    if (forRegNo == null) {
        return false;
    }

    forRegNo = forRegNo.toString().toNumeric();

    var year = forRegNo.substring(0, 2);

    switch (forRegNo.charAt(6)) {
        case "5":
        case "6":
            year = "19" + year;
            break;
        case "7":
        case "8":
            year = "20" + year;
            break;
        default:
            return false;
    }

    var month = forRegNo.substring(2, 4);

    var date = forRegNo.substring(4, 6);

    var yearMonthDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(date, 10));

    if (yearMonthDate.getFullYear() != parseInt(year, 10)) {
        return false;
    }
    if (yearMonthDate.getMonth() != parseInt(month, 10) - 1) {
        return false;
    }
    if (yearMonthDate.getDate() != parseInt(date, 10)) {
        return false;
    }

    if ((parseInt(forRegNo.charAt(7), 10) * 10 + parseInt(forRegNo.charAt(8), 10)) % 2 != 0) {
        return false;
    }

    var sum = 0;

    var mod = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];

    for (var i = 0; i < 12; i++) {
        sum = sum + (parseInt(forRegNo.charAt(i), 10) * mod[i]);
    }

    return ((11 - sum % 11) % 10) + 2 == parseInt(forRegNo.charAt(12), 10);
};

/**
 * 문자열이 사업자등록번호인지 확인한다.
 *
 * Usage: string.isBizRegNo()
 *        string.isBizRegNo(delimiter)
 */
String.prototype.isBizRegNo = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var pattern = new RegExp("[0-9]{3}" + delimiter.meta() + "[0-9]{2}" + delimiter.meta() + "[0-9]{5}$", "");

    var bizRegNo = this.match(pattern);

    if (bizRegNo == null) {
        return false;
    }

    bizRegNo = bizRegNo.toString().toNumeric();

    var sum = parseInt(bizRegNo.charAt(0), 10);

    var mod = [0, 3, 7, 1, 3, 7, 1, 3];

    for (var i = 1; i < 8; i++) {
        sum = sum + ((parseInt(bizRegNo.charAt(i), 10) * mod[i]) % 10);
    }

    sum = sum + Math.floor(parseInt(parseInt(bizRegNo.charAt(8), 10), 10) * 5 / 10);

    sum = sum + ((parseInt(bizRegNo.charAt(8), 10) * 5) % 10 + parseInt(bizRegNo.charAt(9), 10));

    return sum % 10 == 0;
};

/**
 * 문자열이 전자우편주소인지 확인한다.
 *
 * Usage: string.isEmail()
 */
String.prototype.isEmail = function() {
    var pattern = new RegExp("\\w+([\\-\\+\\.]\\w+)*@\\w+([\\-\\.]\\w+)*\\.[a-zA-Z]{2,4}$", "");

    return pattern.test(this);
};

/**
 * 문자열이 유선전화번호인지 확인한다.
 *
 * Usage: string.isPhone()
 *        string.isPhone(delimiter)
 */
String.prototype.isPhone = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var pattern = new RegExp("(02|0[3-9]{1}[0-9]{1})" + delimiter.meta() + "[1-9]{1}[0-9]{2,3}" + delimiter.meta() + "[0-9]{4}$", "");

    return pattern.test(this);
};

/**
 * 문자열이 무선전화번호인지 확인한다.
 *
 * Usage: string.isMobile()
 *        string.isMobile(delimiter)
 */
String.prototype.isMobile = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "";

    var pattern = new RegExp("01[016789]" + delimiter.meta() + "[1-9]{1}[0-9]{2,3}" + delimiter.meta() + "[0-9]{4}$", "");

    return pattern.test(this);
};

/**
 * 문자열이 아이피주소인지 확인한다.
 *
 * Usage: string.isIpAddress()
 */
String.prototype.isIpAddress = function() {
    var pattern = new RegExp("\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b", "");

    return pattern.test(this);
};

/**
 * 문자열이 맥주소인지 확인한다.
 *
 * Usage: string.isMacAddress()
 *        string.isMacAddress(delimiter)
 */
String.prototype.isMacAddress = function() {
    var delimiter = arguments.length > 0 ? arguments[0] : "-";
     
    var pattern = new RegExp("^([0-9a-fA-F][0-9a-fA-F]" + delimiter.meta() + "){5}([0-9a-fA-F][0-9a-fA-F])$", "");

    return pattern.test(this);
};

/**
 * 문자열이 이미지 파일인지 확인한다.
 *
 * Usage: string.isImageFile()
 */
String.prototype.isImageFile = function() {
    var pattern = new RegExp("\\.(jpg|jpeg|gif|png|bmp)$", "i");
    
    return pattern.test(this);
};