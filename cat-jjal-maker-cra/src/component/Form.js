import React from "react";

const Form = ({updateMainCat}) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text); // 한글에 대한 정보를 가지고 있음
  const [value, setValue] = React.useState(""); // 입력한 값 표시용
  const [errorMessage, setErrorMessage] = React.useState(""); // 에러 메시지 전달용

  function handleInputChange(e) {
    const userValue = e.target.value.toUpperCase();
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    }
    setValue(userValue); // 대문자로 변경
  }

  function handleFormSubmit(e) {
    e.preventDefault(); // 리프레시를 막기 위한 용도 (JS 문법)
    setErrorMessage("");
    if (value === "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        <input
          type="text"
          name="name"
          placeholder="영어 대사를 입력해주세요"
          value={value} // input form 에 입력한 값을 보여줌
          onChange={handleInputChange}/>
      </label>
      <button type="submit">생성</button>
      <p style={{color: 'red'}}>{errorMessage}</p>
    </form>
  );
}

export default Form;