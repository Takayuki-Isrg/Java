package org.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AccountDao {
    private static final String URL = "jdbc:mysql://localhost:3306/sample";
    private static final String USER = "root";
    private static final String PASS = "pass";

    private static final String SELECT_SQL = "SELECT * FROM account WHERE id = ?;";
    private static final String INSERT_SQL = "INSERT IGNORE INTO account (id, pass) values(?, ?);";

    /**
     * idを指定し、アカウント情報を取得する
     *
     * @param id 一意のID
     * @return 指定されたIDのアカウント情報、指定されたIDが存在しない場合はnullとする
     */
    public Account search(String id) {

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(SELECT_SQL)) {

            ps.setString(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    if (rs.getString("id").contentEquals(id)) {
                        Account account = new Account();
                        account.setId(id);
                        account.setPass(rs.getString("pass"));
                        return account;
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("データベース接続エラー", e);
        }

        return null;
    }

    public int insert(Account account) {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(INSERT_SQL)) {

            ps.setString(1, account.getId());
            ps.setString(2, account.getPass());

            return ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("データベース接続エラー", e);
        }
    }    
}
