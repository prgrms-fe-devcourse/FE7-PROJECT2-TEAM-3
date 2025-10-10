import { useState, type ChangeEvent } from "react";
import Checkbox from "../../components/ui/Checkbox";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";

export default function Sample() {
  const [shippingMethod, setShippingMethod] = useState("standard");

  // 체크박스 선택값 관리 (여러 개 선택 가능하므로 객체)
  const [options, setOptions] = useState({
    giftWrap: false,
    receipt: true,
    newsletter: false,
  });

  // --- 이벤트 핸들러 ---
  // 라디오 버튼 변경 시 호출될 함수
  const handleShippingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShippingMethod(e.target.value);
  };

  // 체크박스 변경 시 호출될 함수
  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOptions((prevOptions) => ({
      ...prevOptions, // 이전 옵션 상태를 복사하고
      [name]: checked, // 변경된 체크박스의 상태만 업데이트
    }));
  };

  return (
    <>
      <Input type="text" />
      <div>
        <Checkbox
          type="radio"
          name="shipping"
          value="standard"
          checked={shippingMethod === "standard"} // 상태와 연결
          onChange={handleShippingChange}
        >
          일반 배송 (3-5일 소요)
        </Checkbox>
        <Checkbox
          type="radio"
          name="shipping"
          value="express"
          checked={shippingMethod === "express"} // 상태와 연결
          onChange={handleShippingChange}
        >
          빠른 배송 (1-2일 소요)
        </Checkbox>
        <Checkbox
          type="radio"
          name="shipping"
          value="pickup"
          checked={shippingMethod === "pickup"} // 상태와 연결
          onChange={handleShippingChange}
        >
          직접 수령
        </Checkbox>
        <Checkbox id="checkbox-btn" type="checkbox">
          체크박스
        </Checkbox>
      </div>
      <div>
        <Checkbox
          type="checkbox"
          name="giftWrap"
          checked={options.giftWrap} // 상태와 연결
          onChange={handleOptionChange}
        >
          선물 포장 (+3,000원)
        </Checkbox>
        <Checkbox
          type="checkbox"
          name="receipt"
          checked={options.receipt} // 상태와 연결
          onChange={handleOptionChange}
        >
          현금영수증 발행
        </Checkbox>
        <Checkbox
          type="checkbox"
          name="newsletter"
          checked={options.newsletter} // 상태와 연결
          onChange={handleOptionChange}
        >
          뉴스레터 구독
        </Checkbox>
      </div>
      <TextArea id="test" />
    </>
  );
}
