return (<>
<h3>detailed Post</h3>
<p>{`${params.postId}`}</p>
<div>
  {!isModify && (
    <form 
    <label>제목</label>
    
    <div>{content}</div>
  )}
  { isModify && (
    <textarea
      name="content"
      id="content"
      required
      value={content}
      onChange={(e) => setContent(e.target.value)}>
    </textarea>        
  )}
</div>
</>
)