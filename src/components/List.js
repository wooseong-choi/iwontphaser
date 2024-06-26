import "./list.css";

// 이걸로 유저목록 만들어서 포문돌릴것
function getConnectedUser(){
    
}

const List = ()=>{
    getConnectedUser();
    return (
        <>
            <div className="user-list">
                <div className="wrap_search">
                    <input id="csSuggestInputText" type="text" className="" placeholder="Search" value="" />
                    <button id="csSuggestResetBtn" type="button" className="btn_reset hide"><i class="ico_comm ico_reset">검색어 초기화</i></button>
                    <button id="csSuggestSearchBtn" type="button" className="btn_search"><i class="ico_comm ico_search">검색</i></button>
                </div>

            </div>
        </>
    );
}
export default List;