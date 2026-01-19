const pool = require('../config/db');

/**
 * Audit logging service for tracking all critical actions in the system
 */
class AuditService {
  /**
   * Log an audit event
   * @param {string} tenantId - Tenant ID
   * @param {string} userId - User ID who performed the action
   * @param {string} action - Action performed (e.g., 'CREATE_USER', 'UPDATE_PROJECT')
   * @param {string} entity - Entity type (e.g., 'user', 'project', 'task', 'tenant')
   * @param {string} entityId - ID of the affected entity
   * @param {object} metadata - Additional context/metadata (optional)
   */
  async log(tenantId, userId, action, entity, entityId, metadata = {}) {
    try {
      const query = `
        INSERT INTO audit_logs (tenant_id, user_id, action, entity, entity_id, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      
      await pool.query(query, [
        tenantId,
        userId,
        action,
        entity,
        entityId,
        JSON.stringify(metadata)
      ]);
    } catch (err) {
      // Log error but don't throw - audit logging should not break the main flow
      console.error('[AuditService] Failed to log audit event:', err.message);
    }
  }

  /**
   * Convenience methods for common actions
   */
  
  async logUserCreated(tenantId, userId, newUserId, metadata = {}) {
    return this.log(tenantId, userId, 'CREATE_USER', 'user', newUserId, metadata);
  }

  async logUserUpdated(tenantId, userId, updatedUserId, metadata = {}) {
    return this.log(tenantId, userId, 'UPDATE_USER', 'user', updatedUserId, metadata);
  }

  async logUserDeleted(tenantId, userId, deletedUserId, metadata = {}) {
    return this.log(tenantId, userId, 'DELETE_USER', 'user', deletedUserId, metadata);
  }

  async logProjectCreated(tenantId, userId, projectId, metadata = {}) {
    return this.log(tenantId, userId, 'CREATE_PROJECT', 'project', projectId, metadata);
  }

  async logProjectUpdated(tenantId, userId, projectId, metadata = {}) {
    return this.log(tenantId, userId, 'UPDATE_PROJECT', 'project', projectId, metadata);
  }

  async logProjectDeleted(tenantId, userId, projectId, metadata = {}) {
    return this.log(tenantId, userId, 'DELETE_PROJECT', 'project', projectId, metadata);
  }

  async logTaskCreated(tenantId, userId, taskId, metadata = {}) {
    return this.log(tenantId, userId, 'CREATE_TASK', 'task', taskId, metadata);
  }

  async logTaskUpdated(tenantId, userId, taskId, metadata = {}) {
    return this.log(tenantId, userId, 'UPDATE_TASK', 'task', taskId, metadata);
  }

  async logTaskDeleted(tenantId, userId, taskId, metadata = {}) {
    return this.log(tenantId, userId, 'DELETE_TASK', 'task', taskId, metadata);
  }

  async logTenantUpdated(tenantId, userId, metadata = {}) {
    return this.log(tenantId, userId, 'UPDATE_TENANT', 'tenant', tenantId, metadata);
  }

  async logLogin(tenantId, userId, metadata = {}) {
    return this.log(tenantId, userId, 'LOGIN', 'user', userId, metadata);
  }
}

module.exports = new AuditService();
