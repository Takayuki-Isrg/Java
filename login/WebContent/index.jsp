<%@ page language="java" contentType="text/html;
charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<title>ログイン画面</title>
</head>
<body>
	<h1>ログイン画面</h1>

	<form method="post" action="LoginServlet">
		<fieldset>
			<legend>ユーザーID（半角）：</legend>
			<input class="login-form" type="text" name="user_id" value=""
				placeholder="ユーザーID" />
		</fieldset>
		<fieldset>
			<legend>パスワード（半角）：</legend>
			<input class="login-form" type="password" name="password" value=""
				placeholder="パスワード" />
		</fieldset>
		<br /> <input class="login-button" type="submit" name="submit"
			value="ログイン" />
	</form>
</body>
</html>